import React from 'react';
import { AppShell, MainContainer } from './App.styles';
import { BackgroundAnimation } from './components/BackgroundAnimation/BackgroundAnimation';
import { BookListSection } from './components/BookListSection/BookListSection';
import { CsvModal } from './components/CsvModal/CsvModal';
import { DashboardKpis } from './components/DashboardKpis/DashboardKpis';
import { FilterBar } from './components/FilterBar/FilterBar';
import { Footer } from './components/Footer/Footer';
import { HeroHeader } from './components/HeroHeader/HeroHeader';
import { Navbar } from './components/Navbar/Navbar';
import { LibraryProvider } from './contexts/LibraryContext';
import { ThemeProvider } from './contexts/ThemeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
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
          <CsvModal />
        </AppShell>
      </LibraryProvider>
    </ThemeProvider>
  );
};

export default App;