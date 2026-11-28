import styled from '@emotion/styled';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ModalDialog = styled.div`
  width: 100%;
  max-width: 620px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.shadow};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ModalTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ModalIconBadge = styled.span`
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
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const CloseButton = styled.button`
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ProdBadge = styled.div`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.statusReadingBg};
  color: ${({ theme }) => theme.colors.statusReadingText};
`;

export const ModalDescription = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;

  code {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.codeBg};
    padding: 1px 6px;
    border-radius: 5px;
  }
`;

export const LocalGuideCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LocalGuideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export const LocalGuideTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

export const CopyCommandButton = styled.button`
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 7px;
  padding: 5px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 12px 14px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  overflow-x: auto;
`;

export const LocalStepsList = styled.ul`
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;

  code {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.codeBg};
    padding: 1px 6px;
    border-radius: 5px;
  }
`;

export const RepoLinkButton = styled.a`
  margin-top: 4px;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 10px 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.shadowSm};
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

export const BookForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const FieldInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  font-size: 13px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FieldSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ListFlagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

interface ListFlagOptionProps {
  checked: boolean;
}

export const ListFlagOption = styled('label', {
  shouldForwardProp: (prop) => prop !== 'checked',
})<ListFlagOptionProps>`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  background: ${({ theme, checked }) =>
    checked ? theme.colors.surface : theme.colors.codeBg};
  border: 1px solid
    ${({ theme, checked }) =>
      checked ? theme.colors.primary : theme.colors.surfaceBorder};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: ${({ checked }) => (checked ? 600 : 500)};
  color: ${({ theme, checked }) =>
    checked ? theme.colors.text : theme.colors.textMuted};
  transition: border-color 0.2s ease, background-color 0.2s ease;

  input {
    accent-color: ${({ theme }) => theme.colors.primary};
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

export const ReadingSectionBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LegacyToggleButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme, active }) =>
    active ? theme.colors.statusSuccessBg : theme.colors.codeBg};
  color: ${({ theme, active }) =>
    active ? theme.colors.statusSuccessText : theme.colors.text};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.statusSuccessText : theme.colors.surfaceBorder};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SyncHintText = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.45;

  code {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 11px;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.codeBg};
    padding: 1px 5px;
    border-radius: 4px;
  }
`;

interface FeedbackBannerProps {
  variant: 'error' | 'success';
}

export const FeedbackBanner = styled('div', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<FeedbackBannerProps>`
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  background: ${({ theme, variant }) =>
    variant === 'error'
      ? theme.colors.statusReadingBg
      : theme.colors.statusSuccessBg};
  color: ${({ theme, variant }) =>
    variant === 'error'
      ? theme.colors.statusReadingText
      : theme.colors.statusSuccessText};
`;

export const BannerTextWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
`;

export const InlineEditDuplicateButton = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 7px;
  padding: 5px 10px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
  }
`;

export const ModalActionsFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

export const FooterButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SecondaryButton = styled.button`
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 9px 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;