import React from 'react';
import { AppShell, MainContainer } from './App.styles';
import { BackgroundAnimation } from './components/BackgroundAnimation/BackgroundAnimation';
import { BookFormModal } from './components/BookFormModal/BookFormModal';
import { BookListSection } from './components/BookListSection/BookListSection';
import { DashboardKpis } from './components/DashboardKpis/DashboardKpis';
import { FilterBar } from './components/FilterBar/FilterBar';
import { Footer } from './components/Footer/Footer';
import { HeroHeader } from './components/HeroHeader/HeroHeader';
import { Navbar } from './components/Navbar/Navbar';
import { ToastContainer } from './components/ToastContainer/ToastContainer';
import { LibraryProvider } from './contexts/LibraryContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LibraryProvider>
          <BackgroundAnimation />
          <AppShell>
            <Navbar />
            <MainContainer>
              <HeroHeader />
              <DashboardKpis />
              <FilterBar />
              <BookListSection />
              <Footer />
            </MainContainer>
            <BookFormModal />
            <ToastContainer />
          </AppShell>
        </LibraryProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;