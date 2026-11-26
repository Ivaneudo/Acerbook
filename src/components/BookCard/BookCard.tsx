import React from 'react';
import { BookOpen, CheckCircle2, Clock, Pencil, Trash2, User } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { AcervoItem, BookItem, ReadingStatus } from '../../types/book';
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
  MetaItem,
  MetaLabel,
  MetaValue,
  StatusBadge,
} from './BookCard.styles';

interface BookCardProps {
  item: BookItem | AcervoItem;
  isAcervo: boolean;
}

function isAcervoRecord(item: BookItem | AcervoItem): item is AcervoItem {
  return 'dataInicio' in item || 'dataFinal' in item || 'tentativas' in item;
}

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
  const { activeTab, isReadOnlyProd, openEditModal, deleteBook } = useLibrary();

  const acervoData = isAcervo && isAcervoRecord(item) ? item : null;
  const status = acervoData ? getReadingStatus(acervoData) : null;
  const durationDays = acervoData ? getReadingDurationDays(acervoData) : null;

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
                title="Editar livro"
                aria-label={`Editar ${item.livro}`}
              >
                <Pencil size={12} />
              </CardIconButton>
              <CardIconButton
                type="button"
                onClick={() => deleteBook(activeTab, item.id)}
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

        {acervoData && (
          <AcervoMetaGrid>
            <MetaItem>
              <MetaLabel>Início</MetaLabel>
              <MetaValue>{formatField(acervoData.dataInicio)}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Fim</MetaLabel>
              <MetaValue>{formatField(acervoData.dataFinal)}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Tempo de leitura</MetaLabel>
              <MetaValue highlight={durationDays !== null}>
                {durationDisplay}
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Tentativas</MetaLabel>
              <MetaValue>{formatField(acervoData.tentativas)}</MetaValue>
            </MetaItem>
          </AcervoMetaGrid>
        )}
      </CardFooter>
    </Card>
  );
};