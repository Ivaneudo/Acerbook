import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { getDefaultDatasets } from '../data/database';
import {
  AcervoItem,
  BookFormValues,
  BookItem,
  CategoryCount,
  CategoryGroup,
  KpiMetrics,
  LibraryDatasets,
  LibraryTab,
  ViewMode,
} from '../types/book';
import {
  computeKpis,
  getReadingStatus,
  groupBooksByCategoryAndAuthor,
  isSameBookEntry,
  normalizeText,
  serializeCollectionToJson,
} from '../utils/libraryUtils';
import { useToast } from './ToastContext';

const ALL_TABS: LibraryTab[] = ['acervo', 'lidos', 'para_ler', 'para_comprar'];

const STORAGE_KEYS: Record<LibraryTab, string> = {
  acervo: 'acerbook_db_acervo',
  lidos: 'acerbook_db_lidos',
  para_ler: 'acerbook_db_para_ler',
  para_comprar: 'acerbook_db_para_comprar',
};

const IS_READONLY_PROD =
  import.meta.env.PROD && import.meta.env.VITE_ENABLE_LOCAL_EDIT !== 'true';

function loadInitialDatasets(): LibraryDatasets {
  const defaults = getDefaultDatasets();
  if (typeof window === 'undefined' || IS_READONLY_PROD) {
    return defaults;
  }

  const loadTab = <T,>(tab: LibraryTab, fallback: T): T => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS[tab]);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? (parsed as T) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    acervo: loadTab('acervo', defaults.acervo),
    lidos: loadTab('lidos', defaults.lidos),
    para_ler: loadTab('para_ler', defaults.para_ler),
    para_comprar: loadTab('para_comprar', defaults.para_comprar),
  };
}

async function persistTabToDisk(
  tab: LibraryTab,
  items: (BookItem | AcervoItem)[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const content = serializeCollectionToJson(tab, items);
    const response = await fetch('/__acerbook_db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab, content }),
    });

    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || `Falha ao gravar ${tab}.json.`,
      };
    }

    window.localStorage.removeItem(STORAGE_KEYS[tab]);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : `Erro de conexão ao salvar ${tab}.json.`,
    };
  }
}

function appendIfNotExists(
  list: BookItem[],
  book: BookItem
): { next: BookItem[]; changed: boolean } {
  if (list.some((item) => isSameBookEntry(item, book))) {
    return { next: list, changed: false };
  }
  const nextId = list.length > 0 ? Math.max(...list.map((i) => i.id)) + 1 : 1;
  return {
    next: [
      ...list,
      {
        id: nextId,
        categoria: book.categoria,
        autor: book.autor,
        livro: book.livro,
      },
    ],
    changed: true,
  };
}

function removeIfExists<T extends BookItem>(
  list: T[],
  book: BookItem
): { next: T[]; changed: boolean } {
  const next = list.filter((item) => !isSameBookEntry(item, book));
  return { next, changed: next.length !== list.length };
}

function propagateMetadataChange<T extends BookItem>(
  list: T[],
  previousBook: BookItem,
  updatedFields: Pick<BookItem, 'categoria' | 'autor' | 'livro'>
): { next: T[]; changed: boolean } {
  let changed = false;
  const next = list.map((item) => {
    if (!isSameBookEntry(item, previousBook)) return item;
    if (
      item.categoria === updatedFields.categoria &&
      item.autor === updatedFields.autor &&
      item.livro === updatedFields.livro
    ) {
      return item;
    }
    changed = true;
    return {
      ...item,
      categoria: updatedFields.categoria,
      autor: updatedFields.autor,
      livro: updatedFields.livro,
    };
  });
  return { next, changed };
}

export interface EditingBookTarget {
  tab: LibraryTab;
  item: BookItem | AcervoItem;
}

export interface PendingDeleteTarget {
  tab: LibraryTab;
  item: BookItem | AcervoItem;
  alsoInTabs: LibraryTab[];
}

interface LibraryContextValue {
  datasets: LibraryDatasets;
  activeTab: LibraryTab;
  setActiveTab: (tab: LibraryTab) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedAuthor: string;
  setSelectedAuthor: (author: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  kpis: KpiMetrics;
  activeItems: (BookItem | AcervoItem)[];
  filteredItems: (BookItem | AcervoItem)[];
  groupedItems: CategoryGroup<BookItem | AcervoItem>[];
  categoriesWithCount: CategoryCount[];
  allCategoriesForTab: (tab: LibraryTab) => string[];
  allAuthorsForTab: (tab: LibraryTab) => string[];
  authorsList: string[];
  isFormModalOpen: boolean;
  isReadOnlyProd: boolean;
  editingTarget: EditingBookTarget | null;
  pendingDelete: PendingDeleteTarget | null;
  openAddModal: () => void;
  openEditModal: (item: BookItem | AcervoItem) => void;
  closeFormModal: () => void;
  addBook: (values: BookFormValues) => Promise<void>;
  updateBook: (
    originalId: number,
    originalTab: LibraryTab,
    values: BookFormValues
  ) => Promise<void>;
  requestDeleteBook: (tab: LibraryTab, item: BookItem | AcervoItem) => void;
  cancelDeleteBook: () => void;
  confirmDeleteBook: (removeFromAllTabs: boolean) => Promise<void>;
  exportJsonForTab: (tab: LibraryTab) => void;
  resetTabToDefault: (tab: LibraryTab) => void;
  resetAllToDefault: () => void;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [datasets, setDatasets] = useState<LibraryDatasets>(loadInitialDatasets);
  const [activeTab, setActiveTabState] = useState<LibraryTab>('acervo');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedAuthor, setSelectedAuthor] = useState('Todos');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<EditingBookTarget | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDeleteTarget | null>(null);

  const setActiveTab = useCallback((tab: LibraryTab) => {
    setActiveTabState(tab);
    setSelectedCategory('Todas');
    setSelectedAuthor('Todos');
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedAuthor('Todos');
  }, []);

  const kpis = useMemo(() => computeKpis(datasets), [datasets]);

  const activeItems = useMemo(() => datasets[activeTab], [datasets, activeTab]);

  const categoriesWithCount = useMemo<CategoryCount[]>(() => {
    const map = new Map<string, number>();
    activeItems.forEach((item) => {
      map.set(item.categoria, (map.get(item.categoria) || 0) + 1);
    });
    return Array.from(map.entries()).map(([categoria, count]) => ({
      categoria,
      count,
    }));
  }, [activeItems]);

  const allCategoriesForTab = useCallback(
    (tab: LibraryTab) => {
      const set = new Set<string>();
      datasets[tab].forEach((item) => set.add(item.categoria));
      return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    },
    [datasets]
  );

  const allAuthorsForTab = useCallback(
    (tab: LibraryTab) => {
      const set = new Set<string>();
      datasets[tab].forEach((item) => set.add(item.autor));
      return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    },
    [datasets]
  );

  const authorsList = useMemo(() => {
    const set = new Set<string>();
    activeItems.forEach((item) => {
      if (selectedCategory === 'Todas' || item.categoria === selectedCategory) {
        set.add(item.autor);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [activeItems, selectedCategory]);

  const filteredItems = useMemo(() => {
    const normQuery = normalizeText(searchQuery);

    return activeItems.filter((item) => {
      if (selectedCategory !== 'Todas' && item.categoria !== selectedCategory) {
        return false;
      }
      if (selectedAuthor !== 'Todos' && item.autor !== selectedAuthor) {
        return false;
      }
      if (normQuery.length > 0) {
        const matchTitle = normalizeText(item.livro).includes(normQuery);
        const matchAuthor = normalizeText(item.autor).includes(normQuery);
        const matchCategory = normalizeText(item.categoria).includes(normQuery);
        return matchTitle || matchAuthor || matchCategory;
      }
      return true;
    });
  }, [activeItems, selectedCategory, selectedAuthor, searchQuery]);

  const groupedItems = useMemo(
    () => groupBooksByCategoryAndAuthor(filteredItems),
    [filteredItems]
  );

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'Todas' ||
    selectedAuthor !== 'Todos';

  const openAddModal = useCallback(() => {
    setEditingTarget(null);
    setIsFormModalOpen(true);
  }, []);

  const openEditModal = useCallback(
    (item: BookItem | AcervoItem) => {
      if (IS_READONLY_PROD) return;
      setEditingTarget({ tab: activeTab, item });
      setIsFormModalOpen(true);
    },
    [activeTab]
  );

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingTarget(null);
  }, []);

  const persistModifiedTabs = useCallback(
    async (
      nextDatasets: LibraryDatasets,
      dirtyTabs: LibraryTab[],
      successTitle: string,
      successMessage: string
    ) => {
      const results = await Promise.all(
        dirtyTabs.map(async (tab) => ({
          tab,
          res: await persistTabToDisk(tab, nextDatasets[tab]),
        }))
      );

      const failed = results.filter((entry) => !entry.res.ok);
      if (failed.length === 0) {
        showToast({
          variant: 'success',
          title: successTitle,
          message: successMessage,
        });
      } else {
        failed.forEach(({ tab }) => {
          window.localStorage.setItem(
            STORAGE_KEYS[tab],
            JSON.stringify(nextDatasets[tab])
          );
        });
        showToast({
          variant: 'error',
          title: 'Erro ao gravar arquivo JSON',
          message: `${failed[0].res.error ?? 'Erro desconhecido.'} Alterações mantidas no navegador.`,
        });
      }
    },
    [showToast]
  );

  const addBook = useCallback(
    async (values: BookFormValues) => {
      if (IS_READONLY_PROD) return;

      const nextDatasets: LibraryDatasets = { ...datasets };
      const dirtyTabs = new Set<LibraryTab>([values.targetTab]);

      const targetList = nextDatasets[values.targetTab];
      const nextId =
        targetList.length > 0 ? Math.max(...targetList.map((i) => i.id)) + 1 : 1;

      const baseFields = {
        categoria: values.categoria.trim(),
        autor: values.autor.trim(),
        livro: values.livro.trim(),
      };

      if (values.targetTab === 'acervo') {
        const newAcervoItem: AcervoItem = {
          id: nextId,
          ...baseFields,
          dataInicio: values.dataInicio.trim(),
          dataFinal: values.dataFinal.trim(),
          tentativas: values.tentativas.trim(),
        };

        nextDatasets.acervo = [...nextDatasets.acervo, newAcervoItem];

        const buySync = removeIfExists(nextDatasets.para_comprar, newAcervoItem);
        if (buySync.changed) {
          nextDatasets.para_comprar = buySync.next;
          dirtyTabs.add('para_comprar');
        }

        if (getReadingStatus(newAcervoItem) === 'Concluído') {
          const lidosSync = appendIfNotExists(nextDatasets.lidos, newAcervoItem);
          if (lidosSync.changed) {
            nextDatasets.lidos = lidosSync.next;
            dirtyTabs.add('lidos');
          }
          const paraLerSync = removeIfExists(nextDatasets.para_ler, newAcervoItem);
          if (paraLerSync.changed) {
            nextDatasets.para_ler = paraLerSync.next;
            dirtyTabs.add('para_ler');
          }
        }
      } else {
        const newItem: BookItem = {
          id: nextId,
          ...baseFields,
        };
        nextDatasets[values.targetTab] = [...targetList, newItem];

        if (values.targetTab === 'lidos') {
          const paraLerSync = removeIfExists(nextDatasets.para_ler, newItem);
          if (paraLerSync.changed) {
            nextDatasets.para_ler = paraLerSync.next;
            dirtyTabs.add('para_ler');
          }
        }
      }

      setDatasets(nextDatasets);

      const dirtyList = Array.from(dirtyTabs);
      const filesText = dirtyList.map((t) => `${t}.json`).join(', ');
      await persistModifiedTabs(
        nextDatasets,
        dirtyList,
        dirtyList.length > 1 ? 'Salvo e sincronizado!' : 'Livro adicionado!',
        `"${baseFields.livro}" salvo em ${filesText}.`
      );
    },
    [datasets, persistModifiedTabs]
  );

  const updateBook = useCallback(
    async (originalId: number, originalTab: LibraryTab, values: BookFormValues) => {
      if (IS_READONLY_PROD) return;

      const previousItem = datasets[originalTab].find((i) => i.id === originalId);
      if (!previousItem) return;

      const nextDatasets: LibraryDatasets = { ...datasets };
      const dirtyTabs = new Set<LibraryTab>([values.targetTab]);

      const updatedFields = {
        categoria: values.categoria.trim(),
        autor: values.autor.trim(),
        livro: values.livro.trim(),
      };

      const prevAcervoStatus =
        originalTab === 'acervo'
          ? getReadingStatus(previousItem as AcervoItem)
          : null;

      if (originalTab === values.targetTab) {
        if (originalTab === 'acervo') {
          const updatedAcervoItem: AcervoItem = {
            ...(previousItem as AcervoItem),
            ...updatedFields,
            dataInicio: values.dataInicio.trim(),
            dataFinal: values.dataFinal.trim(),
            tentativas: values.tentativas.trim(),
          };

          nextDatasets.acervo = nextDatasets.acervo.map((item) =>
            item.id === originalId ? updatedAcervoItem : item
          );

          (['lidos', 'para_ler', 'para_comprar'] as const).forEach((otherTab) => {
            const prop = propagateMetadataChange(
              nextDatasets[otherTab],
              previousItem,
              updatedFields
            );
            if (prop.changed) {
              nextDatasets[otherTab] = prop.next;
              dirtyTabs.add(otherTab);
            }
          });

          const nextStatus = getReadingStatus(updatedAcervoItem);

          const buySync = removeIfExists(nextDatasets.para_comprar, updatedAcervoItem);
          if (buySync.changed) {
            nextDatasets.para_comprar = buySync.next;
            dirtyTabs.add('para_comprar');
          }

          if (nextStatus === 'Concluído') {
            const lidosSync = appendIfNotExists(nextDatasets.lidos, updatedAcervoItem);
            if (lidosSync.changed) {
              nextDatasets.lidos = lidosSync.next;
              dirtyTabs.add('lidos');
            }
            const paraLerSync = removeIfExists(nextDatasets.para_ler, updatedAcervoItem);
            if (paraLerSync.changed) {
              nextDatasets.para_ler = paraLerSync.next;
              dirtyTabs.add('para_ler');
            }
          } else if (prevAcervoStatus === 'Concluído') {
            const lidosRem = removeIfExists(nextDatasets.lidos, updatedAcervoItem);
            if (lidosRem.changed) {
              nextDatasets.lidos = lidosRem.next;
              dirtyTabs.add('lidos');
            }
          }
        } else {
          const updatedItem: BookItem = {
            ...previousItem,
            ...updatedFields,
          };
          nextDatasets[originalTab] = nextDatasets[originalTab].map((item) =>
            item.id === originalId ? updatedItem : item
          );

          ALL_TABS.filter((t) => t !== originalTab).forEach((otherTab) => {
            if (otherTab === 'acervo') {
              const prop = propagateMetadataChange(
                nextDatasets.acervo,
                previousItem,
                updatedFields
              );
              if (prop.changed) {
                nextDatasets.acervo = prop.next;
                dirtyTabs.add('acervo');
              }
            } else {
              const prop = propagateMetadataChange(
                nextDatasets[otherTab],
                previousItem,
                updatedFields
              );
              if (prop.changed) {
                nextDatasets[otherTab] = prop.next;
                dirtyTabs.add(otherTab);
              }
            }
          });

          if (originalTab === 'lidos') {
            const paraLerSync = removeIfExists(nextDatasets.para_ler, updatedItem);
            if (paraLerSync.changed) {
              nextDatasets.para_ler = paraLerSync.next;
              dirtyTabs.add('para_ler');
            }
          }
        }
      } else {
        dirtyTabs.add(originalTab);

        if (originalTab === 'acervo') {
          nextDatasets.acervo = nextDatasets.acervo.filter(
            (item) => item.id !== originalId
          );

          if (prevAcervoStatus === 'Concluído' && values.targetTab !== 'lidos') {
            const lidosRem = removeIfExists(nextDatasets.lidos, previousItem);
            if (lidosRem.changed) {
              nextDatasets.lidos = lidosRem.next;
              dirtyTabs.add('lidos');
            }
          }
        } else {
          nextDatasets[originalTab] = nextDatasets[originalTab].filter(
            (item) => item.id !== originalId
          );
        }

        const targetList = nextDatasets[values.targetTab];
        const nextId =
          targetList.length > 0 ? Math.max(...targetList.map((i) => i.id)) + 1 : 1;

        if (values.targetTab === 'acervo') {
          const movedAcervo: AcervoItem = {
            id: nextId,
            ...updatedFields,
            dataInicio: values.dataInicio.trim(),
            dataFinal: values.dataFinal.trim(),
            tentativas: values.tentativas.trim(),
          };
          nextDatasets.acervo = [...nextDatasets.acervo, movedAcervo];

          const buySync = removeIfExists(nextDatasets.para_comprar, movedAcervo);
          if (buySync.changed) {
            nextDatasets.para_comprar = buySync.next;
            dirtyTabs.add('para_comprar');
          }

          if (getReadingStatus(movedAcervo) === 'Concluído') {
            const lidosSync = appendIfNotExists(nextDatasets.lidos, movedAcervo);
            if (lidosSync.changed) {
              nextDatasets.lidos = lidosSync.next;
              dirtyTabs.add('lidos');
            }
            const paraLerSync = removeIfExists(nextDatasets.para_ler, movedAcervo);
            if (paraLerSync.changed) {
              nextDatasets.para_ler = paraLerSync.next;
              dirtyTabs.add('para_ler');
            }
          }
        } else {
          const movedBook: BookItem = {
            id: nextId,
            ...updatedFields,
          };
          nextDatasets[values.targetTab] = [...targetList, movedBook];

          if (values.targetTab === 'lidos') {
            const paraLerSync = removeIfExists(nextDatasets.para_ler, movedBook);
            if (paraLerSync.changed) {
              nextDatasets.para_ler = paraLerSync.next;
              dirtyTabs.add('para_ler');
            }
          }
        }
      }

      setDatasets(nextDatasets);

      const dirtyList = Array.from(dirtyTabs);
      const filesText = dirtyList.map((t) => `${t}.json`).join(', ');
      await persistModifiedTabs(
        nextDatasets,
        dirtyList,
        dirtyList.length > 1 ? 'Atualizado e sincronizado!' : 'Alterações salvas!',
        `"${updatedFields.livro}" atualizado em ${filesText}.`
      );
    },
    [datasets, persistModifiedTabs]
  );

  const requestDeleteBook = useCallback(
    (tab: LibraryTab, item: BookItem | AcervoItem) => {
      if (IS_READONLY_PROD) return;

      const alsoInTabs = ALL_TABS.filter(
        (otherTab) =>
          otherTab !== tab &&
          datasets[otherTab].some((entry) => isSameBookEntry(entry, item))
      );

      setPendingDelete({ tab, item, alsoInTabs });
    },
    [datasets]
  );

  const cancelDeleteBook = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const confirmDeleteBook = useCallback(
    async (removeFromAllTabs: boolean) => {
      if (IS_READONLY_PROD || !pendingDelete) return;

      const { tab, item, alsoInTabs } = pendingDelete;
      const tabsToRemove = removeFromAllTabs ? [tab, ...alsoInTabs] : [tab];
      const nextDatasets: LibraryDatasets = { ...datasets };

      tabsToRemove.forEach((target) => {
        if (target === tab) {
          if (target === 'acervo') {
            nextDatasets.acervo = nextDatasets.acervo.filter(
              (entry) => entry.id !== item.id
            );
          } else {
            nextDatasets[target] = nextDatasets[target].filter(
              (entry) => entry.id !== item.id
            );
          }
        } else if (target === 'acervo') {
          nextDatasets.acervo = nextDatasets.acervo.filter(
            (entry) => !isSameBookEntry(entry, item)
          );
        } else {
          nextDatasets[target] = nextDatasets[target].filter(
            (entry) => !isSameBookEntry(entry, item)
          );
        }
      });

      setDatasets(nextDatasets);
      setPendingDelete(null);

      const filesText = tabsToRemove.map((t) => `${t}.json`).join(', ');
      await persistModifiedTabs(
        nextDatasets,
        tabsToRemove,
        'Livro removido!',
        `"${item.livro}" removido de ${filesText}.`
      );
    },
    [datasets, pendingDelete, persistModifiedTabs]
  );

  const exportJsonForTab = useCallback(
    (tab: LibraryTab) => {
      const content = serializeCollectionToJson(tab, datasets[tab]);
      const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tab}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [datasets]
  );

  const resetTabToDefault = useCallback(
    (tab: LibraryTab) => {
      if (IS_READONLY_PROD) return;

      window.localStorage.removeItem(STORAGE_KEYS[tab]);
      const defaults = getDefaultDatasets();
      setDatasets((prev) => ({ ...prev, [tab]: defaults[tab] }));
      showToast({
        variant: 'success',
        title: 'Lista recarregada',
        message: `Lista "${tab}.json" recarregada a partir do disco.`,
      });
    },
    [showToast]
  );

  const resetAllToDefault = useCallback(() => {
    if (IS_READONLY_PROD) return;

    ALL_TABS.forEach((tab) => {
      window.localStorage.removeItem(STORAGE_KEYS[tab]);
    });
    setDatasets(getDefaultDatasets());
    showToast({
      variant: 'success',
      title: 'Banco recarregado',
      message: 'Todas as listas foram recarregadas a partir dos arquivos JSON.',
    });
  }, [showToast]);

  return (
    <LibraryContext.Provider
      value={{
        datasets,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedAuthor,
        setSelectedAuthor,
        clearFilters,
        hasActiveFilters,
        kpis,
        activeItems,
        filteredItems,
        groupedItems,
        categoriesWithCount,
        allCategoriesForTab,
        allAuthorsForTab,
        authorsList,
        isFormModalOpen,
        isReadOnlyProd: IS_READONLY_PROD,
        editingTarget,
        pendingDelete,
        openAddModal,
        openEditModal,
        closeFormModal,
        addBook,
        updateBook,
        requestDeleteBook,
        cancelDeleteBook,
        confirmDeleteBook,
        exportJsonForTab,
        resetTabToDefault,
        resetAllToDefault,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary deve ser usado dentro de LibraryProvider');
  }
  return ctx;
}