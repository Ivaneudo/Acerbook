import styled from '@emotion/styled';

export const KpiWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;
`;

export const KpiPrimaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const KpiMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

interface KpiCardProps {
  active?: boolean;
  clickable?: boolean;
}

export const KpiCard = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'clickable',
})<KpiCardProps>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.surfaceBorder};
  border-radius: 14px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.shadow};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: transform 0.22s ease, box-shadow 0.22s ease,
    border-color 0.22s ease, background-color 0.22s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: ${({ theme }) => theme.shadows.shadowHover};
    transform: ${({ clickable }) => (clickable ? 'translateY(-2px)' : 'none')};
    border-color: ${({ theme, active, clickable }) =>
      active || clickable ? theme.colors.primary : theme.colors.surfaceBorder};
  }
`;

export const KpiHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const KpiLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const KpiIconBox = styled('span', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.codeBg};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

export const KpiValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.1;
`;

export const KpiAccentValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const KpiSubtext = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ProgressSubtext = styled(KpiSubtext)`
  margin-bottom: 6px;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.codeBg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

export const ProgressFill = styled('div', {
  shouldForwardProp: (prop) => prop !== 'percent',
})<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => `${Math.min(100, Math.max(0, percent))}%`};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  transition: width 0.35s ease;
`;