
import {
  BookRecord,
  CategoryGroup,
  KpiMetrics,
  ReadingStatus,
  UnifiedDatabaseFile,
} from '../types/book';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function getReadingStatus(item: BookRecord): ReadingStatus {
  const start = (item.dataInicio || '').trim();
  const end = (item.dataFinal || '').trim();

  const hasRealEndDate = end.length > 0 && end !== '--';
  const hasRealStartDate = start.length > 0 && start !== '--';
  const isLegacyCompleted = start === '--' && end === '--';

  if (hasRealEndDate || isLegacyCompleted || item.listas.includes('lidos')) {
    return 'Concluído';
  }
  if (hasRealStartDate) {
    return 'Lendo';
  }
  return 'Não iniciado';
}

export function parseBrDateUtc(dateStr?: string): number | null {
  const clean = (dateStr || '').trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(clean);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const utcMs = Date.UTC(year, month - 1, day);
  const check = new Date(utcMs);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }

  return utcMs;
}

export function brDateToIsoInput(dateStr?: string): string {
  const clean = (dateStr || '').trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(clean);
  if (!match) return '';
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function isoInputToBrDate(isoStr?: string): string {
  const clean = (isoStr || '').trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean);
  if (!match) return clean;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function getReadingDurationDays(item: BookRecord): number | null {
  const startMs = parseBrDateUtc(item.dataInicio);
  const endMs = parseBrDateUtc(item.dataFinal);

  if (startMs === null || endMs === null || endMs < startMs) {
    return null;
  }

  const diffDays = Math.round((endMs - startMs) / MS_PER_DAY);
  return Math.max(1, diffDays);
}

export function formatReadingDays(days: number): string {
  return days === 1 ? '1 dia' : `${days} dias`;
}

export function computeKpis(books: BookRecord[]): KpiMetrics {
  const acervoBooks = books.filter((b) => b.listas.includes('acervo'));
  const lidosBooks = books.filter((b) => b.listas.includes('lidos'));
  const paraLerBooks = books.filter((b) => b.listas.includes('para_ler'));
  const paraComprarBooks = books.filter((b) => b.listas.includes('para_comprar'));

  let acervoReadCount = 0;
  let acervoReadingCount = 0;

  acervoBooks.forEach((item) => {
    const status = getReadingStatus(item);
    if (status === 'Concluído') {
      acervoReadCount += 1;
    } else if (status === 'Lendo') {
      acervoReadingCount += 1;
    }
  });

  let totalReadingDays = 0;
  let booksWithDatesCount = 0;

  books.forEach((item) => {
    const days = getReadingDurationDays(item);
    if (days !== null) {
      totalReadingDays += days;
      booksWithDatesCount += 1;
    }
  });

  const totalAcervo = acervoBooks.length;
  const acervoReadRatio = totalAcervo > 0 ? acervoReadCount / totalAcervo : 0;
  const acervoReadPercent = `${(acervoReadRatio * 100).toFixed(1).replace('.', ',')}%`;

  return {
    totalAcervo,
    totalLidos: lidosBooks.length,
    totalParaLer: paraLerBooks.length,
    totalParaComprar: paraComprarBooks.length,
    acervoReadCount,
    acervoReadingCount,
    acervoReadPercent,
    acervoReadRatio,
    totalReadingDays,
    booksWithDatesCount,
  };
}

export function groupBooksByCategoryAndAuthor(items: BookRecord[]): CategoryGroup[] {
  const categoryMap = new Map<string, Map<string, BookRecord[]>>();

  items.forEach((item) => {
    const category = item.categoria || 'Sem Categoria';
    const author = item.autor || 'Autor Desconhecido';

    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Map<string, BookRecord[]>());
    }
    const authorMap = categoryMap.get(category)!;
    if (!authorMap.has(author)) {
      authorMap.set(author, []);
    }
    authorMap.get(author)!.push(item);
  });

  const result: CategoryGroup[] = [];
  categoryMap.forEach((authorMap, categoria) => {
    const authors = Array.from(authorMap.entries()).map(([autor, authorItems]) => ({
      autor,
      items: authorItems,
    }));

    const total = authors.reduce((acc, g) => acc + g.items.length, 0);
    result.push({
      categoria,
      total,
      authors,
    });
  });

  return result;
}

export function serializeDatabaseToJson(books: BookRecord[]): string {
  const payload: UnifiedDatabaseFile = {
    versao: 2,
    livros: books.map((book) => ({
      id: book.id,
      categoria: book.categoria,
      autor: book.autor,
      livro: book.livro,
      dataInicio: book.dataInicio ?? '',
      dataFinal: book.dataFinal ?? '',
      tentativas: book.tentativas ?? '',
      listas: book.listas,
    })),
  };

  return JSON.stringify(payload, null, 2);
}