import styled from '@emotion/styled';
import { ReadingStatus } from '../../types/book';

export const Card = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 14px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.shadow};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  transition: transform 0.22s ease, box-shadow 0.22s ease,
    border-color 0.22s ease, background-color 0.22s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: ${({ theme }) => theme.shadows.shadowHover};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CardTopActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const CardIconButton = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const IdBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  padding: 3px 8px;
  border-radius: 6px;
`;

interface StatusBadgeProps {
  status: ReadingStatus;
}

export const StatusBadge = styled('span', {
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

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const BookTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
  word-break: break-word;
`;

export const AuthorLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CategoryPill = styled.span`
  align-self: flex-start;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 6px;
  padding: 3px 8px;
`;

export const AcervoMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const MetaLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const MetaValue = styled('span', {
  shouldForwardProp: (prop) => prop !== 'highlight',
})<{ highlight?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: ${({ highlight }) => (highlight ? 600 : 500)};
  color: ${({ theme, highlight }) =>
    highlight ? theme.colors.primary : theme.colors.text};
`;

export const ListTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

export const ListTagBadge = styled('span', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: ${({ theme, active }) =>
    active ? theme.colors.primaryGlow : theme.colors.codeBg};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.textMuted};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.surfaceBorder};
`;
