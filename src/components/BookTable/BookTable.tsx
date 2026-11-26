import React from 'react';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { AcervoItem, BookItem, ReadingStatus } from '../../types/book';
import {
  formatReadingDays,
  getReadingDurationDays,
  getReadingStatus,
} from '../../utils/csvParser';
import {
  MonoCell,
  StyledTable,
  TableHead,
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
              </Tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableScrollContainer>
  );
};