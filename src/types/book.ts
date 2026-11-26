export type LibraryTab = 'acervo' | 'lidos' | 'para_ler' | 'para_comprar';

export type ViewMode = 'grid' | 'table';

export type ReadingStatus = 'Concluído' | 'Lendo' | 'Não iniciado';

export interface BookItem {
  id: number;
  categoria: string;
  autor: string;
  livro: string;
}

export interface AcervoItem extends BookItem {
  dataInicio: string;
  dataFinal: string;
  tentativas: string;
}

export interface JsonBookEntry {
  id: number;
  autor: string;
  livro: string;
}

export interface JsonAcervoEntry extends JsonBookEntry {
  dataInicio: string;
  dataFinal: string;
  tentativas: string;
}

export interface JsonCollectionFile<TEntry extends JsonBookEntry = JsonBookEntry> {
  colecao: LibraryTab;
  categorias: {
    categoria: string;
    livros: TEntry[];
  }[];
}

export interface LibraryDatasets {
  acervo: AcervoItem[];
  lidos: BookItem[];
  para_ler: BookItem[];
  para_comprar: BookItem[];
}

export interface BookFormValues {
  targetTab: LibraryTab;
  categoria: string;
  autor: string;
  livro: string;
  dataInicio: string;
  dataFinal: string;
  tentativas: string;
}

export interface KpiMetrics {
  totalAcervo: number;
  totalLidos: number;
  totalParaLer: number;
  totalParaComprar: number;
  acervoReadCount: number;
  acervoReadingCount: number;
  acervoReadPercent: string;
  acervoReadRatio: number;
  totalReadingDays: number;
  booksWithDatesCount: number;
}

export interface AuthorGroup<T extends BookItem> {
  autor: string;
  items: T[];
}

export interface CategoryGroup<T extends BookItem> {
  categoria: string;
  total: number;
  authors: AuthorGroup<T>[];
}

export interface CategoryCount {
  categoria: string;
  count: number;
}