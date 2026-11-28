import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { getDefaultBooks } from '../data/database';
import {
  BookFormValues,
  BookRecord,
  CategoryCount,
  CategoryGroup,
  KpiMetrics,
  LibraryTab,
  ViewMode,
} from '../types/book';
import {
  computeKpis,
  groupBooksByCategoryAndAuthor,
  normalizeText,
  serializeDatabaseToJson,
} from '../utils/libraryUtils';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'acerbook_unified_db_v2';

const IS_READONLY_PROD =
  import.meta.env.PROD && import.meta.env.VITE_ENABLE_LOCAL_EDIT !== 'true';

function loadInitialBooks(): BookRecord[] {
  const defaults = getDefaultBooks();
  if (typeof window === 'undefined' || IS_READONLY_PROD) {
    return defaults;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as BookRecord[]) : defaults;
  } catch {
    return defaults;
  }
}

async function persistDatabaseToDisk(
  books: BookRecord[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const content = serializeDatabaseToJson(books);
    const response = await fetch('/__acerbook_db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || 'Falha ao gravar biblioteca.json.',
      };
    }

    window.localStorage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Erro de conexão ao salvar biblioteca.json.',
    };
  }
}

export interface PendingDeleteTarget {
  tab: LibraryTab;
  item: BookRecord;
}

interface LibraryContextValue {
  books: BookRecord[];
  tabCounts: Record<LibraryTab, number>;
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
  activeItems: BookRecord[];
  filteredItems: BookRecord[];
  groupedItems: CategoryGroup[];
  categoriesWithCount: CategoryCount[];
  allCategories: string[];
  allAuthors: string[];
  authorsList: string[];
  isFormModalOpen: boolean;
  isReadOnlyProd: boolean;
  editingBook: BookRecord | null;
  pendingDelete: PendingDeleteTarget | null;
  findDuplicateTitle: (title: string, ignoreId?: number) => BookRecord | null;
  openAddModal: () => void;
  openEditModal: (item: BookRecord) => void;
  closeFormModal: () => void;
  addBook: (values: BookFormValues) => Promise<void>;
  updateBook: (id: number, values: BookFormValues) => Promise<void>;
  requestDeleteBook: (tab: LibraryTab, item: BookRecord) => void;
  cancelDeleteBook: () => void;
  confirmDeleteBook: (removeFromAllLists: boolean) => Promise<void>;
  exportDatabaseJson: () => void;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [books, setBooks] = useState<BookRecord[]>(loadInitialBooks);
  const [activeTab, setActiveTabState] = useState<LibraryTab>('acervo');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedAuthor, setSelectedAuthor] = useState('Todos');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookRecord | null>(null);
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

  const kpis = useMemo(() => computeKpis(books), [books]);

  const tabCounts = useMemo<Record<LibraryTab, number>>(
    () => ({
      acervo: kpis.totalAcervo,
      lidos: kpis.totalLidos,
      para_ler: kpis.totalParaLer,
      para_comprar: kpis.totalParaComprar,
    }),
    [kpis]
  );

  const activeItems = useMemo(
    () => books.filter((book) => book.listas.includes(activeTab)),
    [books, activeTab]
  );

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

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((item) => set.add(item.categoria));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [books]);

  const allAuthors = useMemo(() => {
    const set = new Set<string>();
    books.forEach((item) => set.add(item.autor));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [books]);

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

  const findDuplicateTitle = useCallback(
    (title: string, ignoreId?: number): BookRecord | null => {
      const norm = normalizeText(title);
      if (!norm) return null;
      return (
        books.find(
          (item) => item.id !== ignoreId && normalizeText(item.livro) === norm
        ) ?? null
      );
    },
    [books]
  );

  const openAddModal = useCallback(() => {
    setEditingBook(null);
    setIsFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: BookRecord) => {
    if (IS_READONLY_PROD) return;
    setEditingBook(item);
    setIsFormModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingBook(null);
  }, []);

  const saveAndToast = useCallback(
    async (nextBooks: BookRecord[], title: string, message: string) => {
      setBooks(nextBooks);
      const result = await persistDatabaseToDisk(nextBooks);
      if (result.ok) {
        showToast({ variant: 'success', title, message });
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBooks));
        showToast({
          variant: 'error',
          title: 'Erro ao gravar biblioteca.json',
          message: `${result.error ?? 'Erro desconhecido.'} Alteração salva no navegador.`,
        });
      }
    },
    [showToast]
  );

  const addBook = useCallback(
    async (values: BookFormValues) => {
      if (IS_READONLY_PROD) return;

      const duplicate = findDuplicateTitle(values.livro);
      if (duplicate) {
        showToast({
          variant: 'error',
          title: 'Título já cadastrado',
          message: `"${duplicate.livro}" já existe no banco JSON.`,
        });
        return;
      }

      const nextId =
        books.length > 0 ? Math.max(...books.map((item) => item.id)) + 1 : 1;

      const newBook: BookRecord = {
        id: nextId,
        categoria: values.categoria.trim(),
        autor: values.autor.trim(),
        livro: values.livro.trim(),
        dataInicio: values.dataInicio.trim(),
        dataFinal: values.dataFinal.trim(),
        tentativas: values.tentativas.trim(),
        listas: values.listas,
      };

      const nextBooks = [...books, newBook];
      await saveAndToast(
        nextBooks,
        'Livro adicionado!',
        `"${newBook.livro}" foi salvo em src/data/db/biblioteca.json.`
      );
    },
    [books, findDuplicateTitle, saveAndToast, showToast]
  );

  const updateBook = useCallback(
    async (id: number, values: BookFormValues) => {
      if (IS_READONLY_PROD) return;

      const duplicate = findDuplicateTitle(values.livro, id);
      if (duplicate) {
        showToast({
          variant: 'error',
          title: 'Título duplicado',
          message: `Já existe outro livro chamado "${duplicate.livro}".`,
        });
        return;
      }

      const nextBooks = books.map((item) =>
        item.id === id
          ? {
              ...item,
              categoria: values.categoria.trim(),
              autor: values.autor.trim(),
              livro: values.livro.trim(),
              dataInicio: values.dataInicio.trim(),
              dataFinal: values.dataFinal.trim(),
              tentativas: values.tentativas.trim(),
              listas: values.listas,
            }
          : item
      );

      await saveAndToast(
        nextBooks,
        'Alterações salvas!',
        `"${values.livro.trim()}" atualizado em src/data/db/biblioteca.json.`
      );
    },
    [books, findDuplicateTitle, saveAndToast, showToast]
  );

  const requestDeleteBook = useCallback((tab: LibraryTab, item: BookRecord) => {
    if (IS_READONLY_PROD) return;
    setPendingDelete({ tab, item });
  }, []);

  const cancelDeleteBook = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const confirmDeleteBook = useCallback(
    async (removeFromAllLists: boolean) => {
      if (IS_READONLY_PROD || !pendingDelete) return;

      const { tab, item } = pendingDelete;
      setPendingDelete(null);

      const shouldDeleteCompletely =
        removeFromAllLists || item.listas.length <= 1;

      if (shouldDeleteCompletely) {
        const nextBooks = books.filter((entry) => entry.id !== item.id);
        await saveAndToast(
          nextBooks,
          'Livro excluído!',
          `"${item.livro}" removido de biblioteca.json.`
        );
      } else {
        const nextBooks = books.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                listas: entry.listas.filter((l) => l !== tab),
              }
            : entry
        );
        await saveAndToast(
          nextBooks,
          'Removido da lista!',
          `"${item.livro}" removido apenas desta aba (mantido nas demais flags).`
        );
      }
    },
    [books, pendingDelete, saveAndToast]
  );

  const exportDatabaseJson = useCallback(() => {
    const content = serializeDatabaseToJson(books);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'biblioteca.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [books]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        tabCounts,
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
        allCategories,
        allAuthors,
        authorsList,
        isFormModalOpen,
        isReadOnlyProd: IS_READONLY_PROD,
        editingBook,
        pendingDelete,
        findDuplicateTitle,
        openAddModal,
        openEditModal,
        closeFormModal,
        addBook,
        updateBook,
        requestDeleteBook,
        cancelDeleteBook,
        confirmDeleteBook,
        exportDatabaseJson,
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