import React from 'react';
import { BookOpen, CheckCircle2, Clock, Pencil, Trash2 } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { BookRecord, ReadingStatus } from '../../types/book';
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
  items: BookRecord[];
  isAcervo: boolean;
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
  const showReadingColumns = isAcervo || activeTab === 'lidos';

  return (
    <TableScrollContainer>
      <StyledTable>
        <TableHead>
          <tr>
            <Th>ID</Th>
            <Th>Livro</Th>
            <Th>Autor</Th>
            {showReadingColumns && (
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
            const status = showReadingColumns ? getReadingStatus(item) : null;
            const durationDays = showReadingColumns
              ? getReadingDurationDays(item)
              : null;

            const durationDisplay =
              durationDays !== null
                ? formatReadingDays(durationDays)
                : status === 'Lendo'
                  ? 'Em andamento'
                  : '—';

            return (
              <Tr key={item.id}>
                <Td>
                  <MonoCell>#{String(item.id).padStart(2, '0')}</MonoCell>
                </Td>
                <Td>
                  <TitleCell>{item.livro}</TitleCell>
                </Td>
                <Td>{item.autor}</Td>
                {showReadingColumns && status && (
                  <>
                    <Td>
                      <TableStatusBadge status={status}>
                        {renderStatusIcon(status)}
                        {status}
                      </TableStatusBadge>
                    </Td>
                    <Td>
                      <MonoCell>{formatField(item.dataInicio)}</MonoCell>
                    </Td>
                    <Td>
                      <MonoCell>{formatField(item.dataFinal)}</MonoCell>
                    </Td>
                    <Td>
                      <MonoCell>{durationDisplay}</MonoCell>
                    </Td>
                    <Td>
                      <MonoCell>{formatField(item.tentativas)}</MonoCell>
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