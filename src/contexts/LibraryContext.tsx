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

function appendToLidosIfNeeded(
  currentLidos: BookItem[],
  acervoItem: AcervoItem
): { nextLidos: BookItem[]; added: boolean } {
  if (getReadingStatus(acervoItem) !== 'Concluído') {
    return { nextLidos: currentLidos, added: false };
  }

  const alreadyInLidos = currentLidos.some((lido) =>
    isSameBookEntry(lido, acervoItem)
  );
  if (alreadyInLidos) {
    return { nextLidos: currentLidos, added: false };
  }

  const nextId =
    currentLidos.length > 0 ? Math.max(...currentLidos.map((i) => i.id)) + 1 : 1;

  const newLidoEntry: BookItem = {
    id: nextId,
    categoria: acervoItem.categoria,
    autor: acervoItem.autor,
    livro: acervoItem.livro,
  };

  return {
    nextLidos: [...currentLidos, newLidoEntry],
    added: true,
  };
}

export interface EditingBookTarget {
  tab: LibraryTab;
  item: BookItem | AcervoItem;
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
  openAddModal: () => void;
  openEditModal: (item: BookItem | AcervoItem) => void;
  closeFormModal: () => void;
  addBook: (values: BookFormValues) => Promise<void>;
  updateBook: (
    originalId: number,
    originalTab: LibraryTab,
    values: BookFormValues
  ) => Promise<void>;
  deleteBook: (tab: LibraryTab, id: number) => Promise<void>;
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

  const addBook = useCallback(
    async (values: BookFormValues) => {
      if (IS_READONLY_PROD) return;

      const targetList = datasets[values.targetTab];
      const nextId =
        targetList.length > 0 ? Math.max(...targetList.map((i) => i.id)) + 1 : 1;

      if (values.targetTab === 'acervo') {
        const newAcervoItem: AcervoItem = {
          id: nextId,
          categoria: values.categoria.trim(),
          autor: values.autor.trim(),
          livro: values.livro.trim(),
          dataInicio: values.dataInicio.trim(),
          dataFinal: values.dataFinal.trim(),
          tentativas: values.tentativas.trim(),
        };

        const updatedAcervo = [...datasets.acervo, newAcervoItem];
        const { nextLidos, added: syncedToLidos } = appendToLidosIfNeeded(
          datasets.lidos,
          newAcervoItem
        );

        setDatasets((prev) => ({
          ...prev,
          acervo: updatedAcervo,
          lidos: nextLidos,
        }));

        const tasks = [persistTabToDisk('acervo', updatedAcervo)];
        if (syncedToLidos) {
          tasks.push(persistTabToDisk('lidos', nextLidos));
        }
        const results = await Promise.all(tasks);
        const allOk = results.every((r) => r.ok);

        if (allOk) {
          showToast({
            variant: 'success',
            title: syncedToLidos
              ? 'Salvo no Acervo e em Livros Lidos!'
              : 'Livro adicionado!',
            message: syncedToLidos
              ? `"${newAcervoItem.livro}" foi salvo em acervo.json e adicionado automaticamente em lidos.json.`
              : `"${newAcervoItem.livro}" foi salvo em src/data/db/acervo.json.`,
          });
        } else {
          window.localStorage.setItem(STORAGE_KEYS.acervo, JSON.stringify(updatedAcervo));
          if (syncedToLidos) {
            window.localStorage.setItem(STORAGE_KEYS.lidos, JSON.stringify(nextLidos));
          }
          const firstErr = results.find((r) => !r.ok)?.error;
          showToast({
            variant: 'error',
            title: 'Erro ao gravar arquivo JSON',
            message: `${firstErr ?? 'Erro desconhecido.'} Alteração salva apenas no navegador.`,
          });
        }
        return;
      }

      const newItem: BookItem = {
        id: nextId,
        categoria: values.categoria.trim(),
        autor: values.autor.trim(),
        livro: values.livro.trim(),
      };

      const updatedList = [...targetList, newItem];
      setDatasets((prev) => ({ ...prev, [values.targetTab]: updatedList }));

      const result = await persistTabToDisk(values.targetTab, updatedList);
      if (result.ok) {
        showToast({
          variant: 'success',
          title: 'Livro adicionado!',
          message: `"${newItem.livro}" foi salvo em src/data/db/${values.targetTab}.json.`,
        });
      } else {
        window.localStorage.setItem(
          STORAGE_KEYS[values.targetTab],
          JSON.stringify(updatedList)
        );
        showToast({
          variant: 'error',
          title: 'Erro ao gravar arquivo JSON',
          message: `${result.error} Alteração salva apenas no navegador.`,
        });
      }
    },
    [datasets, showToast]
  );

  const updateBook = useCallback(
    async (originalId: number, originalTab: LibraryTab, values: BookFormValues) => {
      if (IS_READONLY_PROD) return;

      if (originalTab === values.targetTab) {
        if (originalTab === 'acervo') {
          let updatedItemSnapshot: AcervoItem | null = null;
          const updatedAcervo = datasets.acervo.map((item) => {
            if (item.id !== originalId) return item;
            updatedItemSnapshot = {
              ...item,
              categoria: values.categoria.trim(),
              autor: values.autor.trim(),
              livro: values.livro.trim(),
              dataInicio: values.dataInicio.trim(),
              dataFinal: values.dataFinal.trim(),
              tentativas: values.tentativas.trim(),
            };
            return updatedItemSnapshot;
          });

          const { nextLidos, added: syncedToLidos } = updatedItemSnapshot
            ? appendToLidosIfNeeded(datasets.lidos, updatedItemSnapshot)
            : { nextLidos: datasets.lidos, added: false };

          setDatasets((prev) => ({
            ...prev,
            acervo: updatedAcervo,
            lidos: nextLidos,
          }));

          const tasks = [persistTabToDisk('acervo', updatedAcervo)];
          if (syncedToLidos) {
            tasks.push(persistTabToDisk('lidos', nextLidos));
          }
          const results = await Promise.all(tasks);
          const allOk = results.every((r) => r.ok);

          if (allOk) {
            showToast({
              variant: 'success',
              title: syncedToLidos
                ? 'Atualizado e sincronizado com Livros Lidos!'
                : 'Alterações salvas!',
              message: syncedToLidos
                ? `"${values.livro.trim()}" foi atualizado em acervo.json e adicionado automaticamente em lidos.json.`
                : `"${values.livro.trim()}" foi atualizado em src/data/db/acervo.json.`,
            });
          } else {
            window.localStorage.setItem(
              STORAGE_KEYS.acervo,
              JSON.stringify(updatedAcervo)
            );
            if (syncedToLidos) {
              window.localStorage.setItem(STORAGE_KEYS.lidos, JSON.stringify(nextLidos));
            }
            const firstErr = results.find((r) => !r.ok)?.error;
            showToast({
              variant: 'error',
              title: 'Erro ao atualizar arquivo JSON',
              message: `${firstErr ?? 'Erro desconhecido.'} Alteração salva apenas no navegador.`,
            });
          }
          return;
        }

        const updatedList = datasets[originalTab].map((item) =>
          item.id === originalId
            ? {
                ...item,
                categoria: values.categoria.trim(),
                autor: values.autor.trim(),
                livro: values.livro.trim(),
              }
            : item
        );

        setDatasets((prev) => ({ ...prev, [originalTab]: updatedList }));

        const result = await persistTabToDisk(originalTab, updatedList);
        if (result.ok) {
          showToast({
            variant: 'success',
            title: 'Alterações salvas!',
            message: `"${values.livro.trim()}" foi atualizado em src/data/db/${originalTab}.json.`,
          });
        } else {
          window.localStorage.setItem(
            STORAGE_KEYS[originalTab],
            JSON.stringify(updatedList)
          );
          showToast({
            variant: 'error',
            title: 'Erro ao atualizar arquivo JSON',
            message: `${result.error} Alteração salva apenas no navegador.`,
          });
        }
        return;
      }

      // Movendo livro entre coleções
      const filteredOrigin = datasets[originalTab].filter(
        (item) => item.id !== originalId
      );
      const targetList = datasets[values.targetTab];
      const nextId =
        targetList.length > 0 ? Math.max(...targetList.map((i) => i.id)) + 1 : 1;

      const movedItem: BookItem | AcervoItem =
        values.targetTab === 'acervo'
          ? {
              id: nextId,
              categoria: values.categoria.trim(),
              autor: values.autor.trim(),
              livro: values.livro.trim(),
              dataInicio: values.dataInicio.trim(),
              dataFinal: values.dataFinal.trim(),
              tentativas: values.tentativas.trim(),
            }
          : {
              id: nextId,
              categoria: values.categoria.trim(),
              autor: values.autor.trim(),
              livro: values.livro.trim(),
            };

      const updatedTarget = [...targetList, movedItem];

      let nextLidos = datasets.lidos;
      let syncedToLidos = false;
      if (values.targetTab === 'acervo') {
        const syncRes = appendToLidosIfNeeded(
          originalTab === 'lidos' ? filteredOrigin : datasets.lidos,
          movedItem as AcervoItem
        );
        nextLidos = syncRes.nextLidos;
        syncedToLidos = syncRes.added;
      }

      setDatasets((prev) => ({
        ...prev,
        [originalTab]: filteredOrigin,
        [values.targetTab]: updatedTarget,
        ...(syncedToLidos ? { lidos: nextLidos } : {}),
      }));

      const persistTasks = [
        persistTabToDisk(originalTab, filteredOrigin),
        persistTabToDisk(values.targetTab, updatedTarget),
      ];
      if (syncedToLidos) {
        persistTasks.push(persistTabToDisk('lidos', nextLidos));
      }

      const results = await Promise.all(persistTasks);
      const allOk = results.every((r) => r.ok);

      if (allOk) {
        showToast({
          variant: 'success',
          title: syncedToLidos
            ? 'Livro movido e adicionado em Livros Lidos!'
            : 'Livro movido e salvo!',
          message: syncedToLidos
            ? `"${movedItem.livro}" movido para acervo.json e sincronizado em lidos.json.`
            : `"${movedItem.livro}" movido para src/data/db/${values.targetTab}.json.`,
        });
      } else {
        window.localStorage.setItem(
          STORAGE_KEYS[originalTab],
          JSON.stringify(filteredOrigin)
        );
        window.localStorage.setItem(
          STORAGE_KEYS[values.targetTab],
          JSON.stringify(updatedTarget)
        );
        if (syncedToLidos) {
          window.localStorage.setItem(STORAGE_KEYS.lidos, JSON.stringify(nextLidos));
        }
        const firstErr = results.find((r) => !r.ok)?.error;
        showToast({
          variant: 'error',
          title: 'Erro ao atualizar arquivos JSON',
          message: `${firstErr ?? 'Erro desconhecido.'} Alterações mantidas apenas no navegador.`,
        });
      }
    },
    [datasets, showToast]
  );

  const deleteBook = useCallback(
    async (tab: LibraryTab, id: number) => {
      if (IS_READONLY_PROD) return;

      const removed = datasets[tab].find((item) => item.id === id);
      const updatedList = datasets[tab].filter((item) => item.id !== id);

      setDatasets((prev) => ({ ...prev, [tab]: updatedList }));

      const result = await persistTabToDisk(tab, updatedList);
      if (result.ok) {
        showToast({
          variant: 'success',
          title: 'Livro removido!',
          message: `"${removed?.livro ?? 'Item'}" removido de src/data/db/${tab}.json.`,
        });
      } else {
        window.localStorage.setItem(STORAGE_KEYS[tab], JSON.stringify(updatedList));
        showToast({
          variant: 'error',
          title: 'Erro ao gravar remoção no JSON',
          message: `${result.error} Alteração salva apenas no navegador.`,
        });
      }
    },
    [datasets, showToast]
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

    (Object.keys(STORAGE_KEYS) as LibraryTab[]).forEach((tab) => {
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
        openAddModal,
        openEditModal,
        closeFormModal,
        addBook,
        updateBook,
        deleteBook,
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