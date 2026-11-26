import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import {
  ACERVO_CSV,
  LIDOS_CSV,
  PARA_COMPRAR_CSV,
  PARA_LER_CSV,
} from '../data/booksData';
import {
  AcervoItem,
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
  groupBooksByCategoryAndAuthor,
  normalizeText,
  parseAcervoCsv,
  parseBookListCsv,
  serializeAcervoCsv,
  serializeBookListCsv,
} from '../utils/csvParser';

const STORAGE_KEYS: Record<LibraryTab, string> = {
  acervo: 'crimson_lib_csv_acervo',
  lidos: 'crimson_lib_csv_lidos',
  para_ler: 'crimson_lib_csv_para_ler',
  para_comprar: 'crimson_lib_csv_para_comprar',
};

const IS_IMPORT_DISABLED =
  import.meta.env.PROD && import.meta.env.VITE_ENABLE_CSV_IMPORT !== 'true';

function loadInitialDatasets(): LibraryDatasets {
  const getRaw = (tab: LibraryTab, fallback: string) => {
    if (typeof window === 'undefined' || IS_IMPORT_DISABLED) {
      return fallback;
    }
    return window.localStorage.getItem(STORAGE_KEYS[tab]) || fallback;
  };

  const safeParseAcervo = (raw: string): AcervoItem[] => {
    try {
      return parseAcervoCsv(raw);
    } catch {
      return parseAcervoCsv(ACERVO_CSV);
    }
  };

  const safeParseList = (raw: string, fallback: string): BookItem[] => {
    try {
      return parseBookListCsv(raw);
    } catch {
      return parseBookListCsv(fallback);
    }
  };

  return {
    acervo: safeParseAcervo(getRaw('acervo', ACERVO_CSV)),
    lidos: safeParseList(getRaw('lidos', LIDOS_CSV), LIDOS_CSV),
    para_ler: safeParseList(getRaw('para_ler', PARA_LER_CSV), PARA_LER_CSV),
    para_comprar: safeParseList(getRaw('para_comprar', PARA_COMPRAR_CSV), PARA_COMPRAR_CSV),
  };
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
  authorsList: string[];
  isCsvModalOpen: boolean;
  isImportDisabled: boolean;
  openCsvModal: () => void;
  closeCsvModal: () => void;
  importCsvForTab: (tab: LibraryTab, csvContent: string) => void;
  exportCsvForTab: (tab: LibraryTab) => void;
  resetTabToDefault: (tab: LibraryTab) => void;
  resetAllToDefault: () => void;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<LibraryDatasets>(loadInitialDatasets);
  const [activeTab, setActiveTabState] = useState<LibraryTab>('acervo');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedAuthor, setSelectedAuthor] = useState('Todos');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

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

  const importCsvForTab = useCallback((tab: LibraryTab, csvContent: string) => {
    if (IS_IMPORT_DISABLED) {
      throw new Error('Importação de CSV desativada no ambiente de produção.');
    }

    if (tab === 'acervo') {
      const parsed = parseAcervoCsv(csvContent);
      window.localStorage.setItem(STORAGE_KEYS.acervo, csvContent);
      setDatasets((prev) => ({ ...prev, acervo: parsed }));
    } else {
      const parsed = parseBookListCsv(csvContent);
      window.localStorage.setItem(STORAGE_KEYS[tab], csvContent);
      setDatasets((prev) => ({ ...prev, [tab]: parsed }));
    }
  }, []);

  const exportCsvForTab = useCallback(
    (tab: LibraryTab) => {
      const content =
        tab === 'acervo'
          ? serializeAcervoCsv(datasets.acervo)
          : serializeBookListCsv(datasets[tab]);

      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tab}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [datasets]
  );

  const resetTabToDefault = useCallback((tab: LibraryTab) => {
    if (IS_IMPORT_DISABLED) return;

    window.localStorage.removeItem(STORAGE_KEYS[tab]);
    setDatasets((prev) => {
      if (tab === 'acervo') {
        return { ...prev, acervo: parseAcervoCsv(ACERVO_CSV) };
      }
      const fallbackMap = {
        lidos: LIDOS_CSV,
        para_ler: PARA_LER_CSV,
        para_comprar: PARA_COMPRAR_CSV,
      };
      return { ...prev, [tab]: parseBookListCsv(fallbackMap[tab]) };
    });
  }, []);

  const resetAllToDefault = useCallback(() => {
    if (IS_IMPORT_DISABLED) return;

    (Object.keys(STORAGE_KEYS) as LibraryTab[]).forEach((tab) => {
      window.localStorage.removeItem(STORAGE_KEYS[tab]);
    });
    setDatasets({
      acervo: parseAcervoCsv(ACERVO_CSV),
      lidos: parseBookListCsv(LIDOS_CSV),
      para_ler: parseBookListCsv(PARA_LER_CSV),
      para_comprar: parseBookListCsv(PARA_COMPRAR_CSV),
    });
  }, []);

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
        authorsList,
        isCsvModalOpen,
        isImportDisabled: IS_IMPORT_DISABLED,
        openCsvModal: () => setIsCsvModalOpen(true),
        closeCsvModal: () => setIsCsvModalOpen(false),
        importCsvForTab,
        exportCsvForTab,
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