import React, { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { LibraryTab } from '../../types/book';
import {
  CancelButton,
  CloseButton,
  DangerIconBadge,
  LinkedChip,
  LinkedChipsRow,
  LinkedListsBox,
  LinkedListsLabel,
  ModalActions,
  ModalDialog,
  ModalHeader,
  ModalMessage,
  ModalOverlay,
  ModalTitle,
  PrimaryDangerButton,
  SecondaryDangerButton,
  TitleGroup,
} from './ConfirmDeleteModal.styles';

const TAB_LABELS: Record<LibraryTab, string> = {
  acervo: 'Meu Acervo (acervo.json)',
  lidos: 'Livros Lidos (lidos.json)',
  para_ler: 'Para Ler (para_ler.json)',
  para_comprar: 'Lista de Compras (para_comprar.json)',
};

export const ConfirmDeleteModal: React.FC = () => {
  const { pendingDelete, cancelDeleteBook, confirmDeleteBook } = useLibrary();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsDeleting(false);
  }, [pendingDelete]);

  useEffect(() => {
    if (!pendingDelete) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelDeleteBook();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingDelete, cancelDeleteBook]);

  if (!pendingDelete) {
    return null;
  }

  const { tab, item, alsoInTabs } = pendingDelete;
  const hasLinkedLists = alsoInTabs.length > 0;

  const handleConfirm = async (removeFromAll: boolean) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await confirmDeleteBook(removeFromAll);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ModalOverlay onClick={cancelDeleteBook} role="dialog" aria-modal="true">
      <ModalDialog onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <TitleGroup>
            <DangerIconBadge>
              <Trash2 size={16} />
            </DangerIconBadge>
            <ModalTitle>Excluir Livro</ModalTitle>
          </TitleGroup>
          <CloseButton type="button" onClick={cancelDeleteBook} aria-label="Fechar">
            <X size={15} />
          </CloseButton>
        </ModalHeader>

        <ModalMessage>
          Deseja remover <strong>"{item.livro}"</strong> ({item.autor}) de{' '}
          <strong>{TAB_LABELS[tab]}</strong>?
        </ModalMessage>

        {hasLinkedLists && (
          <LinkedListsBox>
            <LinkedListsLabel>
              Este livro também está sincronizado em:
            </LinkedListsLabel>
            <LinkedChipsRow>
              {alsoInTabs.map((otherTab) => (
                <LinkedChip key={otherTab}>{TAB_LABELS[otherTab]}</LinkedChip>
              ))}
            </LinkedChipsRow>
          </LinkedListsBox>
        )}

        <ModalActions>
          <CancelButton type="button" onClick={cancelDeleteBook} disabled={isDeleting}>
            Cancelar
          </CancelButton>

          {hasLinkedLists ? (
            <>
              <SecondaryDangerButton
                type="button"
                disabled={isDeleting}
                onClick={() => handleConfirm(false)}
              >
                Excluir só desta lista
              </SecondaryDangerButton>
              <PrimaryDangerButton
                type="button"
                disabled={isDeleting}
                onClick={() => handleConfirm(true)}
              >
                <Trash2 size={14} />
                {isDeleting ? 'Excluindo...' : 'Excluir de todas as listas'}
              </PrimaryDangerButton>
            </>
          ) : (
            <PrimaryDangerButton
              type="button"
              disabled={isDeleting}
              onClick={() => handleConfirm(false)}
            >
              <Trash2 size={14} />
              {isDeleting ? 'Excluindo...' : 'Confirmar exclusão'}
            </PrimaryDangerButton>
          )}
        </ModalActions>
      </ModalDialog>
    </ModalOverlay>
  );
};