import {
  AcervoItem,
  BookItem,
  CategoryGroup,
  KpiMetrics,
  LibraryDatasets,
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

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCsvRows(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  if (!cleanText) {
    return { headers: [], rows: [] };
  }

  const lines = cleanText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

export function parseBookListCsv(csvText: string): BookItem[] {
  const { headers, rows } = parseCsvRows(csvText);
  if (
    headers.length === 0 ||
    !headers.includes('autor') ||
    !headers.includes('livro')
  ) {
    throw new Error('CSV inválido: cabeçalhos obrigatórios (categoria, autor, livro) não encontrados.');
  }

  return rows.map((row, index) => ({
    id: Number(row.id) || index + 1,
    categoria: row.categoria || 'Sem Categoria',
    autor: row.autor || 'Autor Desconhecido',
    livro: row.livro || 'Sem Título',
  }));
}

export function parseAcervoCsv(csvText: string): AcervoItem[] {
  const { headers, rows } = parseCsvRows(csvText);
  if (
    headers.length === 0 ||
    !headers.includes('autor') ||
    !headers.includes('livro')
  ) {
    throw new Error(
      'CSV de acervo inválido: cabeçalhos obrigatórios (categoria, autor, livro) não encontrados.'
    );
  }

  return rows.map((row, index) => ({
    id: Number(row.id) || index + 1,
    categoria: row.categoria || 'Sem Categoria',
    autor: row.autor || 'Autor Desconhecido',
    livro: row.livro || 'Sem Título',
    dataInicio: row.dataInicio ?? '',
    dataFinal: row.dataFinal ?? '',
    tentativas: row.tentativas ?? '',
  }));
}

function escapeCsvCell(value: string | number): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function serializeBookListCsv(items: BookItem[]): string {
  const header = 'id,categoria,autor,livro';
  const lines = items.map((item) =>
    [item.id, item.categoria, item.autor, item.livro].map(escapeCsvCell).join(',')
  );
  return [header, ...lines].join('\n');
}

export function serializeAcervoCsv(items: AcervoItem[]): string {
  const header = 'id,categoria,autor,livro,dataInicio,dataFinal,tentativas';
  const lines = items.map((item) =>
    [
      item.id,
      item.categoria,
      item.autor,
      item.livro,
      item.dataInicio,
      item.dataFinal,
      item.tentativas,
    ]
      .map(escapeCsvCell)
      .join(',')
  );
  return [header, ...lines].join('\n');
}

export function getReadingStatus(item: AcervoItem): ReadingStatus {
  const start = (item.dataInicio || '').trim();
  const end = (item.dataFinal || '').trim();
  const attempts = Number(item.tentativas);

  const hasRealEndDate = end.length > 0 && end !== '--';
  const hasRealStartDate = start.length > 0 && start !== '--';
  const isLegacyCompleted =
    start === '--' && end === '--' && !Number.isNaN(attempts) && attempts > 0;

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