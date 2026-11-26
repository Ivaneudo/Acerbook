import styled from '@emotion/styled';

export const SectionsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

export const CategoryBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

export const CategoryTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CategoryAccentBar = styled.span`
  width: 4px;
  height: 22px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

export const CategoryTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.h2};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

export const CountBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

export const AuthorGroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const AuthorBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AuthorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const AuthorIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
`;

export const AuthorCount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyStateBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.shadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const EmptyIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.primary};
`;

export const EmptyTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 420px;
`;

export const EmptyResetButton = styled.button`
  margin-top: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }
`;