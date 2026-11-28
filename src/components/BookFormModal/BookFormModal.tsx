import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookPlus,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Lock,
  Save,
  Terminal,
  X,
} from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { BookRecord, LibraryTab } from '../../types/book';
import {
  brDateToIsoInput,
  isoInputToBrDate,
  parseBrDateUtc,
} from '../../utils/libraryUtils';
import {
  BannerTextWrap,
  BookForm,
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
  InlineEditDuplicateButton,
  LegacyToggleButton,
  ListFlagOption,
  ListFlagsGrid,
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
  ReadingSectionBox,
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

const LIST_FLAG_OPTIONS: { id: LibraryTab; label: string }[] = [
  { id: 'acervo', label: 'Meu Acervo' },
  { id: 'lidos', label: 'Livros Lidos' },
  { id: 'para_ler', label: 'Para Ler' },
  { id: 'para_comprar', label: 'Lista de Compras' },
];

const NEW_CATEGORY_SENTINEL = '__NEW_CATEGORY__';

export const BookFormModal: React.FC = () => {
  const {
    isFormModalOpen,
    isReadOnlyProd,
    editingBook,
    closeFormModal,
    openEditModal,
    activeTab,
    allCategories,
    allAuthors,
    findDuplicateTitle,
    addBook,
    updateBook,
    exportDatabaseJson,
  } = useLibrary();

  const [selectedLists, setSelectedLists] = useState<LibraryTab[]>([activeTab]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [autor, setAutor] = useState('');
  const [livro, setLivro] = useState('');
  const [dataInicioIso, setDataInicioIso] = useState('');
  const [dataFinalIso, setDataFinalIso] = useState('');
  const [noDatesLegacyRead, setNoDatesLegacyRead] = useState(false);
  const [tentativas, setTentativas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [duplicateRecord, setDuplicateRecord] = useState<BookRecord | null>(null);

  useEffect(() => {
    if (!isFormModalOpen) return;

    setValidationError(null);
    setDuplicateRecord(null);
    setCopied(false);
    setIsSubmitting(false);

    if (editingBook) {
      setSelectedLists([...editingBook.listas]);
      if (allCategories.includes(editingBook.categoria)) {
        setSelectedCategoryOption(editingBook.categoria);
        setCustomCategory('');
      } else {
        setSelectedCategoryOption(NEW_CATEGORY_SENTINEL);
        setCustomCategory(editingBook.categoria);
      }
      setAutor(editingBook.autor);
      setLivro(editingBook.livro);

      const isLegacy =
        editingBook.dataInicio.trim() === '--' &&
        editingBook.dataFinal.trim() === '--';
      setNoDatesLegacyRead(isLegacy);
      setDataInicioIso(isLegacy ? '' : brDateToIsoInput(editingBook.dataInicio));
      setDataFinalIso(isLegacy ? '' : brDateToIsoInput(editingBook.dataFinal));
      setTentativas(editingBook.tentativas || '');
    } else {
      setSelectedLists([activeTab]);
      setSelectedCategoryOption(allCategories[0] ?? NEW_CATEGORY_SENTINEL);
      setCustomCategory('');
      setAutor('');
      setLivro('');
      const defaultLegacy = activeTab === 'lidos';
      setNoDatesLegacyRead(defaultLegacy);
      setDataInicioIso('');
      setDataFinalIso('');
      setTentativas(activeTab === 'lidos' ? '1' : '');
    }
  }, [isFormModalOpen, editingBook, activeTab, allCategories]);

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

  const toggleListFlag = (tab: LibraryTab) => {
    setValidationError(null);
    setSelectedLists((prev) => {
      const exists = prev.includes(tab);
      if (exists) {
        return prev.filter((item) => item !== tab);
      }
      const next = [...prev, tab];
      if (tab === 'acervo') {
        return next.filter((item) => item !== 'para_comprar');
      }
      if (tab === 'lidos') {
        return next.filter((item) => item !== 'para_ler');
      }
      return next;
    });
  };

  const handleToggleLegacyCompleted = () => {
    setNoDatesLegacyRead((prev) => {
      const next = !prev;
      if (next) {
        setDataInicioIso('');
        setDataFinalIso('');
        if (!tentativas.trim()) {
          setTentativas('1');
        }
        setSelectedLists((lists) => {
          const filtered = lists.filter((l) => l !== 'para_ler');
          return filtered.includes('lidos') ? filtered : [...filtered, 'lidos'];
        });
      }
      return next;
    });
  };

  const handleEndDateChange = (nextIso: string) => {
    setDataFinalIso(nextIso);
    if (nextIso) {
      setNoDatesLegacyRead(false);
      setSelectedLists((lists) => {
        const filtered = lists.filter((l) => l !== 'para_ler');
        return filtered.includes('lidos') ? filtered : [...filtered, 'lidos'];
      });
    } else if (!noDatesLegacyRead) {
      setSelectedLists((lists) => lists.filter((l) => l !== 'lidos'));
    }
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
    setDuplicateRecord(null);

    if (selectedLists.length === 0) {
      setValidationError('Marque pelo menos uma lista para o livro.');
      return;
    }

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

    const existingDuplicate = findDuplicateTitle(livro, editingBook?.id);
    if (existingDuplicate) {
      setDuplicateRecord(existingDuplicate);
      setValidationError(
        `Já existe um livro com o título "${existingDuplicate.livro}" (${existingDuplicate.autor}). Use um título único ou edite o registro existente.`
      );
      return;
    }

    let finalStart = '';
    let finalEnd = '';

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

    const payload = {
      categoria: finalCategory,
      autor: autor.trim(),
      livro: livro.trim(),
      dataInicio: finalStart,
      dataFinal: finalEnd,
      tentativas: tentativas.trim(),
      listas: selectedLists,
    };

    setIsSubmitting(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, payload);
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
            login, o cadastro e a edição de livros ficam desativados para preservar o
            banco <code>biblioteca.json</code> oficial.
          </ModalDescription>

          <LocalGuideCard>
            <LocalGuideHeader>
              <LocalGuideTitle>
                <Terminal size={14} />
                Quer montar sua própria biblioteca JSON?
              </LocalGuideTitle>
              <CopyCommandButton type="button" onClick={handleCopyCommands}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copiado!' : 'Copiar comandos'}
              </CopyCommandButton>
            </LocalGuideHeader>

            <CodeBlock>{LOCAL_COMMANDS}</CodeBlock>

            <LocalStepsList>
              <li>
                Rodando localmente com <code>npm run dev</code>, o formulário é liberado e
                grava diretamente no banco unificado <code>src/data/db/biblioteca.json</code>.
              </li>
              <li>
                No <code>README.md</code> do repositório você encontra todos os detalhes
                para personalizar sua biblioteca.
              </li>
            </LocalStepsList>

            <RepoLinkButton href={README_URL} target="_blank" rel="noopener noreferrer">
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
            <SecondaryButton type="button" onClick={exportDatabaseJson}>
              <Download size={14} />
              Baixar biblioteca.json
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
              {editingBook ? 'Editar Livro' : 'Adicionar Novo Livro'}
            </ModalTitle>
          </ModalTitleGroup>
          <CloseButton type="button" onClick={closeFormModal} aria-label="Fechar modal">
            <X size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalDescription>
          Cada livro possui título único em <code>biblioteca.json</code>. Marque abaixo
          em quais listas ele deve aparecer.
        </ModalDescription>

        <BookForm onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldLabel>Listas em que o livro aparece (Flags) *</FieldLabel>
            <ListFlagsGrid>
              {LIST_FLAG_OPTIONS.map((option) => {
                const isChecked = selectedLists.includes(option.id);
                return (
                  <ListFlagOption key={option.id} checked={isChecked}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleListFlag(option.id)}
                    />
                    {option.label}
                  </ListFlagOption>
                );
              })}
            </ListFlagsGrid>
          </FieldGroup>

          <FormRow>
            <FieldGroup>
              <FieldLabel htmlFor="book-title">Título do Livro (único) *</FieldLabel>
              <FieldInput
                id="book-title"
                type="text"
                value={livro}
                onChange={(e) => {
                  setLivro(e.target.value);
                  setDuplicateRecord(null);
                  setValidationError(null);
                }}
                placeholder="Ex.: Perto do Coração Selvagem"
                required
              />
            </FieldGroup>

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
                {allAuthors.map((itemAuthor) => (
                  <option key={itemAuthor} value={itemAuthor} />
                ))}
              </datalist>
            </FieldGroup>
          </FormRow>

          <FieldGroup>
            <FieldLabel htmlFor="book-category-select">Categoria *</FieldLabel>
            <FieldSelect
              id="book-category-select"
              value={selectedCategoryOption}
              onChange={(e) => setSelectedCategoryOption(e.target.value)}
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value={NEW_CATEGORY_SENTINEL}>+ Nova categoria...</option>
            </FieldSelect>
          </FieldGroup>

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

          <ReadingSectionBox>
            <LegacyToggleButton
              type="button"
              active={noDatesLegacyRead}
              onClick={handleToggleLegacyCompleted}
            >
              <CheckCircle2 size={14} />
              {noDatesLegacyRead
                ? 'Concluído sem datas registrado (--)'
                : 'Marcar como concluído sem datas (--)'}
            </LegacyToggleButton>

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
                  onChange={(e) => handleEndDateChange(e.target.value)}
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
              Você pode preencher datas ou usar o botão <code>--</code> mesmo em livros que
              não estejam no seu acervo. Ao preencher a Data Final ou marcar{' '}
              <code>--</code>, a flag <strong>Livros Lidos</strong> é marcada
              automaticamente.
            </SyncHintText>
          </ReadingSectionBox>

          {validationError && (
            <FeedbackBanner variant="error">
              <BannerTextWrap>
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </BannerTextWrap>
              {duplicateRecord && (
                <InlineEditDuplicateButton
                  type="button"
                  onClick={() => openEditModal(duplicateRecord)}
                >
                  Editar existente
                </InlineEditDuplicateButton>
              )}
            </FeedbackBanner>
          )}

          <ModalActionsFooter>
            <FooterButtonsGroup>
              <SecondaryButton type="button" onClick={exportDatabaseJson}>
                <Download size={14} />
                Exportar biblioteca.json
              </SecondaryButton>
            </FooterButtonsGroup>

            <PrimaryButton type="submit" disabled={isSubmitting}>
              <Save size={14} />
              {isSubmitting
                ? 'Salvando...'
                : editingBook
                  ? 'Salvar alterações'
                  : 'Adicionar livro'}
            </PrimaryButton>
          </ModalActionsFooter>
        </BookForm>
      </ModalDialog>
    </ModalOverlay>
  );
};