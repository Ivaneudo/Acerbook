
export type LibraryTab = 'acervo' | 'lidos' | 'para_ler' | 'para_comprar';

export type ViewMode = 'grid' | 'table';

export type ReadingStatus = 'Concluído' | 'Lendo' | 'Não iniciado';

export interface BookRecord {
  id: number;
  categoria: string;
  autor: string;
  livro: string;
  dataInicio: string;
  dataFinal: string;
  tentativas: string;
  listas: LibraryTab[];
}

export interface UnifiedDatabaseFile {
  versao: number;
  livros: BookRecord[];
}

export interface BookFormValues {
  categoria: string;
  autor: string;
  livro: string;
  dataInicio: string;
  dataFinal: string;
  tentativas: string;
  listas: LibraryTab[];
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

export interface AuthorGroup {
  autor: string;
  items: BookRecord[];
}

export interface CategoryGroup {
  categoria: string;
  total: number;
  authors: AuthorGroup[];
}

export interface CategoryCount {
  categoria: string;
  count: number;
}