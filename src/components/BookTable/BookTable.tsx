import React from 'react';
import { BookOpen, CheckCircle2, Clock, Pencil, Trash2 } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { AcervoItem, BookItem, ReadingStatus } from '../../types/book';
import {
  formatReadingDays,
  getReadingDurationDays,
  getReadingStatus,
} from '../../utils/libraryUtils';
import {
  ActionsCell,
  MonoCell,
  StyledTable,
  TableHead,
  TableIconButton,
  TableScrollContainer,
  TableStatusBadge,
  Td,
  Th,
  TitleCell,
  Tr,
} from './BookTable.styles';

interface BookTableProps {
  items: (BookItem | AcervoItem)[];
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

export const BookTable: React.FC<BookTableProps> = ({ items, isAcervo }) => {
  const { activeTab, isReadOnlyProd, openEditModal, requestDeleteBook } = useLibrary();

  return (
    <TableScrollContainer>
      <StyledTable>
        <TableHead>
          <tr>
            <Th>ID</Th>
            <Th>Livro</Th>
            <Th>Autor</Th>
            {isAcervo && (
              <>
                <Th>Status</Th>
                <Th>Início</Th>
                <Th>Fim</Th>
                <Th>Tempo</Th>
                <Th>Tentativas</Th>
              </>
            )}
            {!isReadOnlyProd && <Th>Ações</Th>}
          </tr>
        </TableHead>
        <tbody>
          {items.map((item) => {
            const acervo = isAcervo && isAcervoRecord(item) ? item : null;
            const status = acervo ? getReadingStatus(acervo) : null;
            const durationDays = acervo ? getReadingDurationDays(acervo) : null;

            const durationDisplay =
              durationDays !== null
                ? formatReadingDays(durationDays)
                : status === 'Lendo'
                  ? 'Em andamento'
                  : '—';

            return (
              <Tr key={`${item.id}-${item.livro}`}>
                <Td>
                  <MonoCell>#{String(item.id).padStart(2, '0')}</MonoCell>
                </Td>
                <Td>
                  <TitleCell>{item.livro}</TitleCell>
                </Td>
                <Td>{item.autor}</Td>
                {acervo && status && (
                  <>
                    <Td>
                      <TableStatusBadge status={status}>
                        {renderStatusIcon(status)}
                        {status}
                      </TableStatusBadge>
                    </Td>
                    <Td>
                      <MonoCell>{formatField(acervo.dataInicio)}</MonoCell>
                    </Td>
                    <Td>
                      <MonoCell>{formatField(acervo.dataFinal)}</MonoCell>
                    </Td>
                    <Td>
                      <MonoCell>{durationDisplay}</MonoCell>
                    </Td>
                    <Td>
                      <MonoCell>{formatField(acervo.tentativas)}</MonoCell>
                    </Td>
                  </>
                )}
                {!isReadOnlyProd && (
                  <Td>
                    <ActionsCell>
                      <TableIconButton
                        type="button"
                        onClick={() => openEditModal(item)}
                        title="Editar livro"
                      >
                        <Pencil size={13} />
                      </TableIconButton>
                      <TableIconButton
                        type="button"
                        onClick={() => requestDeleteBook(activeTab, item)}
                        title="Remover livro"
                      >
                        <Trash2 size={13} />
                      </TableIconButton>
                    </ActionsCell>
                  </Td>
                )}
              </Tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableScrollContainer>
  );
};