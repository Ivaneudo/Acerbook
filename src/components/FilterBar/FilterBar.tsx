import React from 'react';
import { LayoutGrid, RotateCcw, Search, Table2, X } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import {
  AuthorSelect,
  AuthorSelectWrapper,
  CategoriesRow,
  CategoryChip,
  ChipCount,
  ClearInputButton,
  FilterPanel,
  ResetFilterButton,
  RightControls,
  SearchIconBox,
  SearchInput,
  SearchWrapper,
  SummaryRow,
  TopControlsRow,
  ViewToggleButton,
  ViewToggleGroup,
} from './FilterBar.styles';

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedAuthor,
    setSelectedAuthor,
    viewMode,
    setViewMode,
    categoriesWithCount,
    authorsList,
    activeItems,
    filteredItems,
    hasActiveFilters,
    clearFilters,
  } = useLibrary();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedAuthor('Todos');
  };

  return (
    <FilterPanel aria-label="Filtros e pesquisa">
      <TopControlsRow>
        <SearchWrapper>
          <SearchIconBox>
            <Search size={16} />
          </SearchIconBox>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, autor ou categoria (ignora acentos)..."
            aria-label="Buscar livros ou autores"
          />
          {searchQuery && (
            <ClearInputButton
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Limpar busca"
            >
              <X size={15} />
            </ClearInputButton>
          )}
        </SearchWrapper>

        <RightControls>
          <AuthorSelectWrapper>
            <AuthorSelect
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              aria-label="Filtrar por autor"
            >
              <option value="Todos">Todos os autores ({authorsList.length})</option>
              {authorsList.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </AuthorSelect>
          </AuthorSelectWrapper>

          <ViewToggleGroup role="group" aria-label="Modo de visualização">
            <ViewToggleButton
              type="button"
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={14} />
              Cards
            </ViewToggleButton>
            <ViewToggleButton
              type="button"
              active={viewMode === 'table'}
              onClick={() => setViewMode('table')}
            >
              <Table2 size={14} />
              Tabela
            </ViewToggleButton>
          </ViewToggleGroup>
        </RightControls>
      </TopControlsRow>

      <CategoriesRow role="group" aria-label="Filtrar por categoria">
        <CategoryChip
          type="button"
          active={selectedCategory === 'Todas'}
          onClick={() => handleCategoryChange('Todas')}
        >
          Todas
          <ChipCount active={selectedCategory === 'Todas'}>
            {activeItems.length}
          </ChipCount>
        </CategoryChip>

        {categoriesWithCount.map(({ categoria, count }) => (
          <CategoryChip
            key={categoria}
            type="button"
            active={selectedCategory === categoria}
            onClick={() => handleCategoryChange(categoria)}
          >
            {categoria}
            <ChipCount active={selectedCategory === categoria}>{count}</ChipCount>
          </CategoryChip>
        ))}
      </CategoriesRow>

      <SummaryRow>
        <span>
          Exibindo <strong>{filteredItems.length}</strong> de{' '}
          <strong>{activeItems.length}</strong> livros
        </span>
        {hasActiveFilters && (
          <ResetFilterButton type="button" onClick={clearFilters}>
            <RotateCcw size={13} />
            Limpar filtros
          </ResetFilterButton>
        )}
      </SummaryRow>
    </FilterPanel>
  );
};