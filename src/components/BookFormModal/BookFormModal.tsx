import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookPlus,
  Check,
  Copy,
  Download,
  ExternalLink,
  Lock,
  Save,
  Terminal,
  X,
} from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { AcervoItem, LibraryTab } from '../../types/book';
import {
  brDateToIsoInput,
  isoInputToBrDate,
  parseBrDateUtc,
} from '../../utils/libraryUtils';
import {
  AcervoSectionBox,
  BookForm,
  CheckboxRow,
  CloseButton,
  CodeBlock,
  CopyCommandButton,
  FeedbackBanner,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldSelect,
  FooterButtonsGroup,
  FormRow,
  LocalGuideCard,
  LocalGuideHeader,
  LocalGuideTitle,
  LocalStepsList,
  ModalActionsFooter,
  ModalDescription,
  ModalDialog,
  ModalHeader,
  ModalIconBadge,
  ModalOverlay,
  ModalTitle,
  ModalTitleGroup,
  PrimaryButton,
  ProdBadge,
  RepoLinkButton,
  SecondaryButton,
  SyncHintText,
} from './BookFormModal.styles';

const REPO_URL = 'https://github.com/Ivaneudo/Acerbook';
const README_URL = `${REPO_URL}#readme`;

const LOCAL_COMMANDS = `git clone ${REPO_URL}.git
cd Acerbook
npm install
npm run dev`;

const TAB_OPTIONS: { value: LibraryTab; label: string }[] = [
  { value: 'acervo', label: 'Meu Acervo (acervo.json)' },
  { value: 'lidos', label: 'Livros Lidos (lidos.json)' },
  { value: 'para_ler', label: 'Para Ler (para_ler.json)' },
  { value: 'para_comprar', label: 'Lista de Compras (para_comprar.json)' },
];

const NEW_CATEGORY_SENTINEL = '__NEW_CATEGORY__';

export const BookFormModal: React.FC = () => {
  const {
    isFormModalOpen,
    isReadOnlyProd,
    editingTarget,
    closeFormModal,
    activeTab,
    allCategoriesForTab,
    allAuthorsForTab,
    addBook,
    updateBook,
    exportJsonForTab,
  } = useLibrary();

  const [targetTab, setTargetTab] = useState<LibraryTab>(activeTab);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [autor, setAutor] = useState('');
  const [livro, setLivro] = useState('');
  const [dataInicioIso, setDataInicioIso] = useState('');
  const [dataFinalIso, setDataFinalIso] = useState('');
  const [noDatesLegacyRead, setNoDatesLegacyRead] = useState(false);
  const [tentativas, setTentativas] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFormModalOpen) return;

    setValidationError(null);
    setCopied(false);
    setIsSubmitting(false);

    if (editingTarget) {
      const { tab, item } = editingTarget;
      setTargetTab(tab);
      const cats = allCategoriesForTab(tab);
      if (cats.includes(item.categoria)) {
        setSelectedCategoryOption(item.categoria);
        setCustomCategory('');
      } else {
        setSelectedCategoryOption(NEW_CATEGORY_SENTINEL);
        setCustomCategory(item.categoria);
      }
      setAutor(item.autor);
      setLivro(item.livro);

      if (tab === 'acervo') {
        const acervo = item as AcervoItem;
        const isLegacy =
          acervo.dataInicio.trim() === '--' && acervo.dataFinal.trim() === '--';
        setNoDatesLegacyRead(isLegacy);
        setDataInicioIso(isLegacy ? '' : brDateToIsoInput(acervo.dataInicio));
        setDataFinalIso(isLegacy ? '' : brDateToIsoInput(acervo.dataFinal));
        setTentativas(acervo.tentativas || '');
      } else {
        setNoDatesLegacyRead(false);
        setDataInicioIso('');
        setDataFinalIso('');
        setTentativas('1');
      }
    } else {
      const cats = allCategoriesForTab(activeTab);
      setTargetTab(activeTab);
      setSelectedCategoryOption(cats[0] ?? NEW_CATEGORY_SENTINEL);
      setCustomCategory('');
      setAutor('');
      setLivro('');
      setNoDatesLegacyRead(false);
      setDataInicioIso('');
      setDataFinalIso('');
      setTentativas('1');
    }
  }, [isFormModalOpen, editingTarget, activeTab, allCategoriesForTab]);

  useEffect(() => {
    if (!isFormModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFormModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormModalOpen, closeFormModal]);

  if (!isFormModalOpen) {
    return null;
  }

  const availableCategories = allCategoriesForTab(targetTab);
  const availableAuthors = allAuthorsForTab(targetTab);

  const handleTabChange = (nextTab: LibraryTab) => {
    setTargetTab(nextTab);
    const nextCats = allCategoriesForTab(nextTab);
    if (
      selectedCategoryOption !== NEW_CATEGORY_SENTINEL &&
      !nextCats.includes(selectedCategoryOption)
    ) {
      setSelectedCategoryOption(nextCats[0] ?? NEW_CATEGORY_SENTINEL);
    }
    setValidationError(null);
  };

  const handleCopyCommands = async () => {
    try {
      await navigator.clipboard.writeText(LOCAL_COMMANDS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setValidationError(null);

    const finalCategory =
      selectedCategoryOption === NEW_CATEGORY_SENTINEL
        ? customCategory.trim()
        : selectedCategoryOption.trim();

    if (!finalCategory) {
      setValidationError('Informe ou selecione uma categoria.');
      return;
    }

    if (!autor.trim() || !livro.trim()) {
      setValidationError('Preencha os campos obrigatórios: Autor e Título do Livro.');
      return;
    }

    let finalStart = '';
    let finalEnd = '';

    if (targetTab === 'acervo') {
      if (noDatesLegacyRead) {
        finalStart = '--';
        finalEnd = '--';
      } else {
        finalStart = isoInputToBrDate(dataInicioIso);
        finalEnd = isoInputToBrDate(dataFinalIso);

        if (finalStart && finalEnd) {
          const startMs = parseBrDateUtc(finalStart);
          const endMs = parseBrDateUtc(finalEnd);
          if (startMs !== null && endMs !== null && endMs < startMs) {
            setValidationError('A data final não pode ser anterior à data de início.');
            return;
          }
        }
      }
    }

    const payload = {
      targetTab,
      categoria: finalCategory,
      autor: autor.trim(),
      livro: livro.trim(),
      dataInicio: finalStart,
      dataFinal: finalEnd,
      tentativas: targetTab === 'acervo' ? tentativas.trim() : '',
    };

    setIsSubmitting(true);
    try {
      if (editingTarget) {
        await updateBook(editingTarget.item.id, editingTarget.tab, payload);
      } else {
        await addBook(payload);
      }
      closeFormModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReadOnlyProd) {
    return (
      <ModalOverlay onClick={closeFormModal} role="dialog" aria-modal="true">
        <ModalDialog onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitleGroup>
              <ModalIconBadge>
                <Lock size={17} />
              </ModalIconBadge>
              <ModalTitle>Customização Desativada em Produção</ModalTitle>
            </ModalTitleGroup>
            <CloseButton type="button" onClick={closeFormModal} aria-label="Fechar modal">
              <X size={16} />
            </CloseButton>
          </ModalHeader>

          <ProdBadge>
            <Lock size={11} />
            ambiente público • somente leitura
          </ProdBadge>

          <ModalDescription>
            Como o <strong>Acerbook</strong> está publicado em produção sem sistema de
            login, o cadastro e a edição de livros via formulário ficam desativados para
            preservar o banco JSON oficial desta página.
          </ModalDescription>

          <LocalGuideCard>
            <LocalGuideHeader>
              <LocalGuideTitle>
                <Terminal size={14} />
                Quer montar e atualizar sua própria biblioteca JSON?
              </LocalGuideTitle>
              <CopyCommandButton type="button" onClick={handleCopyCommands}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copiado!' : 'Copiar comandos'}
              </CopyCommandButton>
            </LocalGuideHeader>

            <CodeBlock>{LOCAL_COMMANDS}</CodeBlock>

            <LocalStepsList>
              <li>
                Rodando localmente com <code>npm run dev</code>, o formulário de cadastro
                e edição é liberado automaticamente e grava direto nos arquivos em{' '}
                <code>src/data/db/</code>.
              </li>
              <li>
                No <code>README.md</code> do repositório há o passo a passo completo para
                personalizar e publicar sua própria versão.
              </li>
            </LocalStepsList>

            <RepoLinkButton
              href={README_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Abrir repositório e README no GitHub
              <ExternalLink size={13} />
            </RepoLinkButton>
          </LocalGuideCard>

          <ModalActionsFooter>
            <SecondaryButton type="button" onClick={() => exportJsonForTab(activeTab)}>
              <Download size={14} />
              Exportar JSON desta aba
            </SecondaryButton>

            <PrimaryButton type="button" onClick={closeFormModal}>
              Entendi
            </PrimaryButton>
          </ModalActionsFooter>
        </ModalDialog>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={closeFormModal} role="dialog" aria-modal="true">
      <ModalDialog onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitleGroup>
            <ModalIconBadge>
              <BookPlus size={17} />
            </ModalIconBadge>
            <ModalTitle>
              {editingTarget ? 'Editar Livro' : 'Adicionar Novo Livro'}
            </ModalTitle>
          </ModalTitleGroup>
          <CloseButton type="button" onClick={closeFormModal} aria-label="Fechar modal">
            <X size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalDescription>
          Ao salvar em ambiente local, o arquivo correspondente em{' '}
          <code>src/data/db/</code> é atualizado automaticamente.
        </ModalDescription>

        <BookForm onSubmit={handleSubmit}>
          <FormRow>
            <FieldGroup>
              <FieldLabel htmlFor="book-target-tab">Lista (Banco JSON)</FieldLabel>
              <FieldSelect
                id="book-target-tab"
                value={targetTab}
                onChange={(e) => handleTabChange(e.target.value as LibraryTab)}
              >
                {TAB_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </FieldSelect>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="book-category-select">Categoria</FieldLabel>
              <FieldSelect
                id="book-category-select"
                value={selectedCategoryOption}
                onChange={(e) => setSelectedCategoryOption(e.target.value)}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value={NEW_CATEGORY_SENTINEL}>+ Nova categoria...</option>
              </FieldSelect>
            </FieldGroup>
          </FormRow>

          {selectedCategoryOption === NEW_CATEGORY_SENTINEL && (
            <FieldGroup>
              <FieldLabel htmlFor="book-custom-category">Nome da nova categoria</FieldLabel>
              <FieldInput
                id="book-custom-category"
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Ex.: Ficção Científica"
                required
              />
            </FieldGroup>
          )}

          <FormRow>
            <FieldGroup>
              <FieldLabel htmlFor="book-author">Autor *</FieldLabel>
              <FieldInput
                id="book-author"
                type="text"
                list="acerbook-authors-datalist"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Ex.: Clarice Lispector"
                required
              />
              <datalist id="acerbook-authors-datalist">
                {availableAuthors.map((itemAuthor) => (
                  <option key={itemAuthor} value={itemAuthor} />
                ))}
              </datalist>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="book-title">Título do Livro *</FieldLabel>
              <FieldInput
                id="book-title"
                type="text"
                value={livro}
                onChange={(e) => setLivro(e.target.value)}
                placeholder="Ex.: Perto do Coração Selvagem"
                required
              />
            </FieldGroup>
          </FormRow>

          {targetTab === 'acervo' && (
            <AcervoSectionBox>
              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={noDatesLegacyRead}
                  onChange={(e) => setNoDatesLegacyRead(e.target.checked)}
                />
                Livro já concluído sem registro de datas (usa <code>--</code>)
              </CheckboxRow>

              <FormRow>
                <FieldGroup>
                  <FieldLabel htmlFor="book-start-date">Data de Início</FieldLabel>
                  <FieldInput
                    id="book-start-date"
                    type="date"
                    value={dataInicioIso}
                    disabled={noDatesLegacyRead}
                    onChange={(e) => setDataInicioIso(e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="book-end-date">Data Final</FieldLabel>
                  <FieldInput
                    id="book-end-date"
                    type="date"
                    value={dataFinalIso}
                    disabled={noDatesLegacyRead}
                    onChange={(e) => setDataFinalIso(e.target.value)}
                  />
                </FieldGroup>
              </FormRow>

              <FieldGroup>
                <FieldLabel htmlFor="book-attempts">Tentativas de leitura</FieldLabel>
                <FieldInput
                  id="book-attempts"
                  type="number"
                  min={0}
                  value={tentativas}
                  onChange={(e) => setTentativas(e.target.value)}
                  placeholder="Ex.: 1"
                />
              </FieldGroup>
              <SyncHintText>
                Livros concluídos (com Data Final ou marcados como <code>--</code>) são
                adicionados automaticamente em <code>lidos.json</code>.
              </SyncHintText>
            </AcervoSectionBox>
            
          )}

          {validationError && (
            <FeedbackBanner variant="error">
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </FeedbackBanner>
          )}

          <ModalActionsFooter>
            <FooterButtonsGroup>
              <SecondaryButton
                type="button"
                onClick={() => exportJsonForTab(targetTab)}
              >
                <Download size={14} />
                Exportar JSON
              </SecondaryButton>
            </FooterButtonsGroup>

            <PrimaryButton type="submit" disabled={isSubmitting}>
              <Save size={14} />
              {isSubmitting
                ? 'Salvando...'
                : editingTarget
                  ? 'Salvar alterações'
                  : 'Adicionar livro'}
            </PrimaryButton>
          </ModalActionsFooter>
        </BookForm>
      </ModalDialog>
    </ModalOverlay>
  );
};