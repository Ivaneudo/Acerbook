import styled from '@emotion/styled';

export const FilterPanel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 16px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.shadow};
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TopControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1 1 280px;
  min-width: 0;
  display: flex;
  align-items: center;
`;

export const SearchIconBox = styled.span`
  position: absolute;
  left: 12px;
  display: inline-flex;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 38px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryGlow};
  }
`;

export const ClearInputButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 4px;
  border-radius: 6px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: space-between;
  }
`;

export const AuthorSelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 210px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex: 1;
    min-width: 0;
  }
`;

export const AuthorSelect = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ViewToggleGroup = styled.div`
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 3px;
  gap: 3px;
`;

interface ViewButtonProps {
  active: boolean;
}

export const ViewToggleButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<ViewButtonProps>`
  height: 34px;
  padding: 0 12px;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 500;
  background: ${({ theme, active }) =>
    active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, active }) => (active ? '#FFFFFF' : theme.colors.textMuted)};
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${({ theme, active }) => (active ? '#FFFFFF' : theme.colors.text)};
  }
`;

export const CategoriesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const CategoryChip = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<ViewButtonProps>`
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  background: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.codeBg};
  color: ${({ theme, active }) => (active ? '#FFFFFF' : theme.colors.textMuted)};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.surfaceBorder};
  box-shadow: ${({ theme }) => theme.shadows.shadowSm};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, active }) => (active ? '#FFFFFF' : theme.colors.text)};
  }
`;

export const ChipCount = styled('span', {
  shouldForwardProp: (prop) => prop !== 'active',
})<ViewButtonProps>`
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 999px;
  background: ${({ theme, active }) =>
    active ? 'rgba(255, 255, 255, 0.22)' : theme.colors.surfaceBorder};
  color: ${({ theme, active }) => (active ? '#FFFFFF' : theme.colors.textMuted)};
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ResetFilterButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: underline;
  }
`;