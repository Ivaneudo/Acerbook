import React, { useEffect, useRef, useState } from 'react';
import {
  BookMarked,
  BookOpenCheck,
  Bookmark,
  Download,
  Lock,
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  Upload,
  X,
} from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { LibraryTab } from '../../types/book';
import {
  ActionButton,
  ActionsGroup,
  Brand,
  BrandAccent,
  DesktopNavLinks,
  HeaderWrapper,
  IconOnlyButton,
  MobileActionButton,
  MobileDrawer,
  MobileDrawerActions,
  MobileMenuToggle,
  MobileTabButton,
  NavInner,
  NavTabButton,
  TabBadge,
} from './Navbar.styles';

const TAB_CONFIG: {
  id: LibraryTab;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'acervo', label: 'Meu Acervo', icon: <BookMarked size={15} /> },
  { id: 'lidos', label: 'Livros Lidos', icon: <BookOpenCheck size={15} /> },
  { id: 'para_ler', label: 'Para Ler', icon: <Bookmark size={15} /> },
  { id: 'para_comprar', label: 'Lista de Compras', icon: <ShoppingBag size={15} /> },
];

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    datasets,
    openCsvModal,
    exportCsvForTab,
    isImportDisabled,
  } = useLibrary();
  const { isDark, toggleTheme } = useThemeMode();

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);

      if (isMobileOpen || currentY <= 80) {
        setIsVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      const diff = currentY - lastScrollY.current;
      if (diff > 8) {
        setIsVisible(false);
      } else if (diff < -6) {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileOpen]);

  const handleSelectTab = (tab: LibraryTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      <HeaderWrapper isVisible={isVisible} isScrolled={isScrolled}>
        <NavInner>
          <Brand onClick={() => handleSelectTab('acervo')} title="Ir para Meu Acervo">
            Acer<BrandAccent>book</BrandAccent>
          </Brand>

          <DesktopNavLinks aria-label="Seções da biblioteca">
            {TAB_CONFIG.map((tab) => (
              <NavTabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => handleSelectTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
                <TabBadge active={activeTab === tab.id}>
                  {datasets[tab.id].length}
                </TabBadge>
              </NavTabButton>
            ))}
          </DesktopNavLinks>

          <ActionsGroup>
            <ActionButton
              isLocked={isImportDisabled}
              onClick={openCsvModal}
              title={
                isImportDisabled
                  ? 'Customização desativada em produção (clique para saber mais)'
                  : 'Importar ou restaurar CSV'
              }
            >
              {isImportDisabled ? <Lock size={14} /> : <Upload size={14} />}
              Importar CSV
            </ActionButton>
            <ActionButton
              onClick={() => exportCsvForTab(activeTab)}
              title="Exportar lista atual em CSV"
            >
              <Download size={14} />
              Exportar CSV
            </ActionButton>

            <IconOnlyButton
              onClick={toggleTheme}
              aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title={isDark ? 'Tema Claro' : 'Tema Escuro'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </IconOnlyButton>

            <MobileMenuToggle
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={19} /> : <Menu size={19} />}
            </MobileMenuToggle>
          </ActionsGroup>
        </NavInner>
      </HeaderWrapper>

      <MobileDrawer isOpen={isMobileOpen}>
        {TAB_CONFIG.map((tab) => (
          <MobileTabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => handleSelectTab(tab.id)}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {tab.icon}
              {tab.label}
            </span>
            <TabBadge active={activeTab === tab.id}>{datasets[tab.id].length}</TabBadge>
          </MobileTabButton>
        ))}

        <MobileDrawerActions>
          <MobileActionButton
            isLocked={isImportDisabled}
            onClick={() => {
              setIsMobileOpen(false);
              openCsvModal();
            }}
          >
            {isImportDisabled ? <Lock size={14} /> : <Upload size={14} />}
            Importar CSV
          </MobileActionButton>
          <MobileActionButton
            onClick={() => {
              setIsMobileOpen(false);
              exportCsvForTab(activeTab);
            }}
          >
            <Download size={14} />
            Exportar CSV
          </MobileActionButton>
        </MobileDrawerActions>
      </MobileDrawer>
    </>
  );
};