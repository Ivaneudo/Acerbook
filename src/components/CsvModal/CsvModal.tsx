import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Lock,
  RotateCcw,
  Terminal,
  UploadCloud,
  X,
} from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { LibraryTab } from '../../types/book';
import {
  CloseButton,
  CodeBlock,
  CopyCommandButton,
  FeedbackBanner,
  FieldGroup,
  FieldLabel,
  FooterButtonsGroup,
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
  TargetSelect,
  UploadBox,
  UploadHint,
  UploadTitle,
} from './CsvModal.styles';

const REPO_URL = 'https://github.com/Ivaneudo/Acerbook';
const README_URL = `${REPO_URL}#readme`;

const LOCAL_COMMANDS = `git clone ${REPO_URL}.git
cd Acerbook
npm install
npm run dev`;

const TAB_OPTIONS: { value: LibraryTab; label: string; expectedCols: string }[] = [
  {
    value: 'acervo',
    label: 'Meu Acervo (acervo.csv)',
    expectedCols: 'id,categoria,autor,livro,dataInicio,dataFinal,tentativas',
  },
  {
    value: 'lidos',
    label: 'Livros Lidos (lidos.csv)',
    expectedCols: 'id,categoria,autor,livro',
  },
  {
    value: 'para_ler',
    label: 'Para Ler (para_ler.csv)',
    expectedCols: 'id,categoria,autor,livro',
  },
  {
    value: 'para_comprar',
    label: 'Lista de Compras (para_comprar.csv)',
    expectedCols: 'id,categoria,autor,livro',
  },
];

export const CsvModal: React.FC = () => {
  const {
    isCsvModalOpen,
    isImportDisabled,
    closeCsvModal,
    activeTab,
    importCsvForTab,
    exportCsvForTab,
    resetTabToDefault,
    resetAllToDefault,
  } = useLibrary();

  const [targetTab, setTargetTab] = useState<LibraryTab>(activeTab);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: 'error' | 'success';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isCsvModalOpen) {
      setTargetTab(activeTab);
      setFeedback(null);
      setCopied(false);
    }
  }, [isCsvModalOpen, activeTab]);

  useEffect(() => {
    if (!isCsvModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCsvModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCsvModalOpen, closeCsvModal]);

  if (!isCsvModalOpen) {
    return null;
  }

  const selectedMeta = TAB_OPTIONS.find((t) => t.value === targetTab)!;

  const handleCopyCommands = async () => {
    try {
      await navigator.clipboard.writeText(LOCAL_COMMANDS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        importCsvForTab(targetTab, text);
        setFeedback({
          variant: 'success',
          message: `Arquivo "${file.name}" importado e salvo localmente em ${selectedMeta.label}!`,
        });
      } catch (err) {
        setFeedback({
          variant: 'error',
          message:
            err instanceof Error
              ? err.message
              : 'Não foi possível processar o arquivo CSV.',
        });
      }
    };
    reader.onerror = () => {
      setFeedback({
        variant: 'error',
        message: 'Erro ao ler o arquivo selecionado.',
      });
    };
    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
  };

  if (isImportDisabled) {
    return (
      <ModalOverlay onClick={closeCsvModal} role="dialog" aria-modal="true">
        <ModalDialog onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitleGroup>
              <ModalIconBadge>
                <Lock size={17} />
              </ModalIconBadge>
              <ModalTitle>Customização Desativada em Produção</ModalTitle>
            </ModalTitleGroup>
            <CloseButton type="button" onClick={closeCsvModal} aria-label="Fechar modal">
              <X size={16} />
            </CloseButton>
          </ModalHeader>

          <ProdBadge>
            <Lock size={11} />
            ambiente público • somente leitura
          </ProdBadge>

          <ModalDescription>
            Como o <strong>Acerbook</strong> está publicado em produção sem sistema de
            login, a importação e edição via <code>.csv</code> fica desativada para
            preservar o acervo oficial desta página.
          </ModalDescription>

          <LocalGuideCard>
            <LocalGuideHeader>
              <LocalGuideTitle>
                <Terminal size={14} />
                Quer montar sua própria biblioteca com seus CSVs?
              </LocalGuideTitle>
              <CopyCommandButton type="button" onClick={handleCopyCommands}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copiado!' : 'Copiar comandos'}
              </CopyCommandButton>
            </LocalGuideHeader>

            <CodeBlock>{LOCAL_COMMANDS}</CodeBlock>

            <LocalStepsList>
              <li>
                Ao rodar localmente com <code>npm run dev</code>, o botão{' '}
                <strong>Importar CSV</strong> é liberado para você subir suas próprias
                planilhas no navegador.
              </li>
              <li>
                No <code>README.md</code> do repositório você encontra o modelo exato das
                colunas CSV e como personalizar os arquivos padrão em{' '}
                <code>src/data/booksData.ts</code>.
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
            <SecondaryButton type="button" onClick={() => exportCsvForTab(activeTab)}>
              <Download size={14} />
              Baixar CSV desta aba
            </SecondaryButton>

            <PrimaryButton type="button" onClick={closeCsvModal}>
              Entendi
            </PrimaryButton>
          </ModalActionsFooter>
        </ModalDialog>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={closeCsvModal} role="dialog" aria-modal="true">
      <ModalDialog onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Gerenciar Dados CSV</ModalTitle>
          <CloseButton type="button" onClick={closeCsvModal} aria-label="Fechar modal">
            <X size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalDescription>
          Faça upload de um arquivo <code>.csv</code> para atualizar qualquer uma das
          4 listas no navegador (salvo automaticamente no <code>localStorage</code>).
        </ModalDescription>

        <FieldGroup>
          <FieldLabel htmlFor="csv-target-select">Lista de destino</FieldLabel>
          <TargetSelect
            id="csv-target-select"
            value={targetTab}
            onChange={(e) => {
              setTargetTab(e.target.value as LibraryTab);
              setFeedback(null);
            }}
          >
            {TAB_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TargetSelect>
        </FieldGroup>

        <UploadBox>
          <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
          <UploadCloud size={26} />
          <UploadTitle>Clique para selecionar um arquivo .csv</UploadTitle>
          <UploadHint>Colunas esperadas: {selectedMeta.expectedCols}</UploadHint>
        </UploadBox>

        {feedback && (
          <FeedbackBanner variant={feedback.variant}>
            {feedback.variant === 'error' ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            <span>{feedback.message}</span>
          </FeedbackBanner>
        )}

        <ModalActionsFooter>
          <SecondaryButton type="button" onClick={() => exportCsvForTab(targetTab)}>
            <Download size={14} />
            Exportar esta lista
          </SecondaryButton>

          <FooterButtonsGroup>
            <SecondaryButton
              type="button"
              onClick={() => {
                resetTabToDefault(targetTab);
                setFeedback({
                  variant: 'success',
                  message: `Lista "${selectedMeta.label}" restaurada para o CSV original.`,
                });
              }}
            >
              <RotateCcw size={14} />
              Restaurar lista
            </SecondaryButton>

            <SecondaryButton
              type="button"
              onClick={() => {
                resetAllToDefault();
                setFeedback({
                  variant: 'success',
                  message: 'Todas as 4 listas foram restauradas para os dados originais.',
                });
              }}
            >
              Restaurar tudo
            </SecondaryButton>
          </FooterButtonsGroup>
        </ModalActionsFooter>
      </ModalDialog>
    </ModalOverlay>
  );
};