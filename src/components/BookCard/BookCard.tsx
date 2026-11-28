import React from 'react';
import { BookOpen, CheckCircle2, Clock, Pencil, Trash2, User } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { BookRecord, LibraryTab, ReadingStatus } from '../../types/book';
import {
  formatReadingDays,
  getReadingDurationDays,
  getReadingStatus,
} from '../../utils/libraryUtils';
import {
  AcervoMetaGrid,
  AuthorLine,
  BookTitle,
  Card,
  CardBody,
  CardFooter,
  CardIconButton,
  CardTop,
  CardTopActions,
  CategoryPill,
  IdBadge,
  ListTagBadge,
  ListTagsRow,
  MetaItem,
  MetaLabel,
  MetaValue,
  StatusBadge,
} from './BookCard.styles';

interface BookCardProps {
  item: BookRecord;
  isAcervo: boolean;
}

const LIST_LABELS: Record<LibraryTab, string> = {
  acervo: 'Acervo',
  lidos: 'Lidos',
  para_ler: 'Para Ler',
  para_comprar: 'Comprar',
};

function renderStatusIcon(status: ReadingStatus) {
  if (status === 'Concluído') return <CheckCircle2 size={12} />;
  if (status === 'Lendo') return <BookOpen size={12} />;
  return <Clock size={12} />;
}

function formatField(value?: string): string {
  const clean = (value || '').trim();
  return clean.length > 0 ? clean : '—';
}

export const BookCard: React.FC<BookCardProps> = ({ item, isAcervo }) => {
  const { activeTab, isReadOnlyProd, openEditModal, requestDeleteBook } = useLibrary();

  const hasReadingInfo = Boolean(
    isAcervo ||
      item.listas.includes('acervo') ||
      item.listas.includes('lidos') ||
      item.dataInicio.trim() ||
      item.dataFinal.trim() ||
      item.tentativas.trim()
  );

  const status = hasReadingInfo ? getReadingStatus(item) : null;
  const durationDays = hasReadingInfo ? getReadingDurationDays(item) : null;

  const durationDisplay =
    durationDays !== null
      ? formatReadingDays(durationDays)
      : status === 'Lendo'
        ? 'Em andamento'
        : '—';

  return (
    <Card>
      <CardTop>
        <IdBadge>#{String(item.id).padStart(2, '0')}</IdBadge>
        <CardTopActions>
          {status && (
            <StatusBadge status={status}>
              {renderStatusIcon(status)}
              {status}
            </StatusBadge>
          )}
          {!isReadOnlyProd && (
            <>
              <CardIconButton
                type="button"
                onClick={() => openEditModal(item)}
                title="Editar livro e flags"
                aria-label={`Editar ${item.livro}`}
              >
                <Pencil size={12} />
              </CardIconButton>
              <CardIconButton
                type="button"
                onClick={() => requestDeleteBook(activeTab, item)}
                title="Remover livro"
                aria-label={`Remover ${item.livro}`}
              >
                <Trash2 size={12} />
              </CardIconButton>
            </>
          )}
        </CardTopActions>
      </CardTop>

      <CardBody>
        <BookTitle>{item.livro}</BookTitle>
        <AuthorLine>
          <User size={13} />
          <span>{item.autor}</span>
        </AuthorLine>
      </CardBody>

      <CardFooter>
        <CategoryPill>{item.categoria}</CategoryPill>

        <ListTagsRow>
          {item.listas.map((listKey) => (
            <ListTagBadge key={listKey} active={listKey === activeTab}>
              {LIST_LABELS[listKey]}
            </ListTagBadge>
          ))}
        </ListTagsRow>

        {hasReadingInfo && (
          <AcervoMetaGrid>
            <MetaItem>
              <MetaLabel>Início</MetaLabel>
              <MetaValue>{formatField(item.dataInicio)}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Fim</MetaLabel>
              <MetaValue>{formatField(item.dataFinal)}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Tempo de leitura</MetaLabel>
              <MetaValue highlight={durationDays !== null}>
                {durationDisplay}
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Tentativas</MetaLabel>
              <MetaValue>{formatField(item.tentativas)}</MetaValue>
            </MetaItem>
          </AcervoMetaGrid>
        )}
      </CardFooter>
    </Card>
  );
};