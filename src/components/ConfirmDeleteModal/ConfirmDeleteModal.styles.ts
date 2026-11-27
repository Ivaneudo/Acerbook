import styled from '@emotion/styled';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 110;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ModalDialog = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.shadow};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DangerIconBadge = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.statusReadingBg};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

export const ModalTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const CloseButton = styled.button`
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ModalMessage = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.55;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const LinkedListsBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LinkedListsLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const LinkedChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const LinkedChip = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

export const CancelButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 9px 14px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const SecondaryDangerButton = styled.button`
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 9px 14px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PrimaryDangerButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  padding: 9px 15px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;