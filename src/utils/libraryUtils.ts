import {
  AcervoItem,
  BookItem,
  CategoryGroup,
  JsonAcervoEntry,
  JsonBookEntry,
  JsonCollectionFile,
  KpiMetrics,
  LibraryDatasets,
  LibraryTab,
  ReadingStatus,
} from '../types/book';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export function isSameBookEntry(a: BookItem, b: BookItem): boolean {
  const normAuthorA = normalizeText(a.autor);
  const normAuthorB = normalizeText(b.autor);
  if (normAuthorA !== normAuthorB) {
    return false;
  }

  const normTitleA = normalizeText(a.livro);
  const normTitleB = normalizeText(b.livro);
  if (normTitleA === normTitleB) {
    return true;
  }

  return levenshteinDistance(normTitleA, normTitleB) <= 2;
}

export function getReadingStatus(item: AcervoItem): ReadingStatus {
  const start = (item.dataInicio || '').trim();
  const end = (item.dataFinal || '').trim();

  const hasRealEndDate = end.length > 0 && end !== '--';
  const hasRealStartDate = start.length > 0 && start !== '--';
  const isLegacyCompleted = start === '--' && end === '--';

  if (hasRealEndDate || isLegacyCompleted) {
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

export function getReadingDurationDays(item: AcervoItem): number | null {
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

export function computeKpis(datasets: LibraryDatasets): KpiMetrics {
  const totalAcervo = datasets.acervo.length;
  const totalLidos = datasets.lidos.length;
  const totalParaLer = datasets.para_ler.length;
  const totalParaComprar = datasets.para_comprar.length;

  let acervoReadCount = 0;
  let acervoReadingCount = 0;
  let totalReadingDays = 0;
  let booksWithDatesCount = 0;

  datasets.acervo.forEach((item) => {
    const status = getReadingStatus(item);
    if (status === 'Concluído') {
      acervoReadCount += 1;
    } else if (status === 'Lendo') {
      acervoReadingCount += 1;
    }

    const days = getReadingDurationDays(item);
    if (days !== null) {
      totalReadingDays += days;
      booksWithDatesCount += 1;
    }
  });

  const acervoReadRatio = totalAcervo > 0 ? acervoReadCount / totalAcervo : 0;
  const acervoReadPercent = `${(acervoReadRatio * 100).toFixed(1).replace('.', ',')}%`;

  return {
    totalAcervo,
    totalLidos,
    totalParaLer,
    totalParaComprar,
    acervoReadCount,
    acervoReadingCount,
    acervoReadPercent,
    acervoReadRatio,
    totalReadingDays,
    booksWithDatesCount,
  };
}

export function groupBooksByCategoryAndAuthor<T extends BookItem>(
  items: T[]
): CategoryGroup<T>[] {
  const categoryMap = new Map<string, Map<string, T[]>>();

  items.forEach((item) => {
    const category = item.categoria || 'Sem Categoria';
    const author = item.autor || 'Autor Desconhecido';

    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Map<string, T[]>());
    }
    const authorMap = categoryMap.get(category)!;
    if (!authorMap.has(author)) {
      authorMap.set(author, []);
    }
    authorMap.get(author)!.push(item);
  });

  const result: CategoryGroup<T>[] = [];
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

export function serializeCollectionToJson(
  tab: LibraryTab,
  items: (BookItem | AcervoItem)[]
): string {
  const categoryMap = new Map<string, (JsonBookEntry | JsonAcervoEntry)[]>();

  items.forEach((item) => {
    const cat = item.categoria || 'Sem Categoria';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }

    if (tab === 'acervo') {
      const acervo = item as AcervoItem;
      categoryMap.get(cat)!.push({
        id: acervo.id,
        autor: acervo.autor,
        livro: acervo.livro,
        dataInicio: acervo.dataInicio ?? '',
        dataFinal: acervo.dataFinal ?? '',
        tentativas: acervo.tentativas ?? '',
      });
    } else {
      categoryMap.get(cat)!.push({
        id: item.id,
        autor: item.autor,
        livro: item.livro,
      });
    }
  });

  const structured: JsonCollectionFile<JsonBookEntry | JsonAcervoEntry> = {
    colecao: tab,
    categorias: Array.from(categoryMap.entries()).map(([categoria, livros]) => ({
      categoria,
      livros,
    })),
  };

  return JSON.stringify(structured, null, 2);
}