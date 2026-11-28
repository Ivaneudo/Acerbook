import bibliotecaRaw from './db/biblioteca.json';
import { BookRecord, UnifiedDatabaseFile } from '../types/book';

export function getDefaultBooks(): BookRecord[] {
  const db = bibliotecaRaw as UnifiedDatabaseFile;
  return db.livros.map((entry) => ({
    id: entry.id,
    categoria: entry.categoria || 'Sem Categoria',
    autor: entry.autor || 'Autor Desconhecido',
    livro: entry.livro || 'Sem Título',
    dataInicio: entry.dataInicio ?? '',
    dataFinal: entry.dataFinal ?? '',
    tentativas: entry.tentativas ?? '',
    listas: Array.isArray(entry.listas) ? [...entry.listas] : [],
  }));
}