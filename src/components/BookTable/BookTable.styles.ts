import styled from '@emotion/styled';
import { ReadingStatus } from '../../types/book';

export const TableScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 14px;
  box-shadow: ${({ theme }) => theme.shadows.shadow};
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 620px;
  text-align: left;
`;

export const TableHead = styled.thead`
  background: ${({ theme }) => theme.colors.codeBg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

export const Th = styled.th`
  padding: 12px 14px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  transition: background-color 0.18s ease;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

export const Td = styled.td`
  padding: 12px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;
`;

export const MonoCell = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

export const TitleCell = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

interface StatusBadgeProps {
  status: ReadingStatus;
}

export const TableStatusBadge = styled('span', {
  shouldForwardProp: (prop) => prop !== 'status',
})<StatusBadgeProps>`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;

  ${({ theme, status }) => {
    if (status === 'Concluído') {
      return `
        background: ${theme.colors.statusSuccessBg};
        color: ${theme.colors.statusSuccessText};
      `;
    }
    if (status === 'Lendo') {
      return `
        background: ${theme.colors.statusReadingBg};
        color: ${theme.colors.statusReadingText};
      `;
    }
    return `
      background: ${theme.colors.statusIdleBg};
      color: ${theme.colors.statusIdleText};
    `;
  }}
`;