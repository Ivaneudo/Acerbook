import acervoRaw from './db/acervo.json';
import lidosRaw from './db/lidos.json';
import paraLerRaw from './db/para_ler.json';
import paraComprarRaw from './db/para_comprar.json';
import {
  AcervoItem,
  BookItem,
  JsonAcervoEntry,
  JsonBookEntry,
  JsonCollectionFile,
  LibraryDatasets,
} from '../types/book';

function flattenBookCollection(
  collection: JsonCollectionFile<JsonBookEntry>
): BookItem[] {
  return collection.categorias.flatMap((group) =>
    group.livros.map((entry) => ({
      id: entry.id,
      categoria: group.categoria,
      autor: entry.autor,
      livro: entry.livro,
    }))
  );
}

function flattenAcervoCollection(
  collection: JsonCollectionFile<JsonAcervoEntry>
): AcervoItem[] {
  return collection.categorias.flatMap((group) =>
    group.livros.map((entry) => ({
      id: entry.id,
      categoria: group.categoria,
      autor: entry.autor,
      livro: entry.livro,
      dataInicio: entry.dataInicio ?? '',
      dataFinal: entry.dataFinal ?? '',
      tentativas: entry.tentativas ?? '',
    }))
  );
}

export function getDefaultDatasets(): LibraryDatasets {
  return {
    acervo: flattenAcervoCollection(acervoRaw as JsonCollectionFile<JsonAcervoEntry>),
    lidos: flattenBookCollection(lidosRaw as JsonCollectionFile<JsonBookEntry>),
    para_ler: flattenBookCollection(paraLerRaw as JsonCollectionFile<JsonBookEntry>),
    para_comprar: flattenBookCollection(
      paraComprarRaw as JsonCollectionFile<JsonBookEntry>
    ),
  };
}