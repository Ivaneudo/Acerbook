import React from 'react';
import { BookX, Feather } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { BookCard } from '../BookCard/BookCard';
import { BookTable } from '../BookTable/BookTable';
import {
  AuthorBlock,
  AuthorCount,
  AuthorGroupsWrapper,
  AuthorHeader,
  AuthorIcon,
  CardsGrid,
  CategoryAccentBar,
  CategoryBlock,
  CategoryHeader,
  CategoryTitle,
  CategoryTitleWrap,
  CountBadge,
  EmptyIconWrap,
  EmptyResetButton,
  EmptyStateBox,
  EmptyText,
  EmptyTitle,
  SectionsStack,
} from './BookListSection.styles';

export const BookListSection: React.FC = () => {
  const { groupedItems, viewMode, activeTab, clearFilters } = useLibrary();
  const isAcervo = activeTab === 'acervo';

  if (groupedItems.length === 0) {
    return (
      <EmptyStateBox>
        <EmptyIconWrap>
          <BookX size={24} />
        </EmptyIconWrap>
        <EmptyTitle>Nenhum livro encontrado</EmptyTitle>
        <EmptyText>
          Não encontramos títulos correspondentes aos filtros atuais. Tente ajustar a busca ou limpar os filtros selecionados.
        </EmptyText>
        <EmptyResetButton type="button" onClick={clearFilters}>
          Restaurar filtros
        </EmptyResetButton>
      </EmptyStateBox>
    );
  }

  return (
    <SectionsStack>
      {groupedItems.map((categoryGroup) => {
        const allCategoryItems = categoryGroup.authors.flatMap((a) => a.items);

        return (
          <CategoryBlock key={categoryGroup.categoria}>
            <CategoryHeader>
              <CategoryTitleWrap>
                <CategoryAccentBar />
                <CategoryTitle>{categoryGroup.categoria}</CategoryTitle>
              </CategoryTitleWrap>
              <CountBadge>
                {categoryGroup.total}{' '}
                {categoryGroup.total === 1 ? 'livro' : 'livros'}
              </CountBadge>
            </CategoryHeader>

            {viewMode === 'table' ? (
              <BookTable items={allCategoryItems} isAcervo={isAcervo} />
            ) : (
              <AuthorGroupsWrapper>
                {categoryGroup.authors.map((authorGroup) => (
                  <AuthorBlock key={authorGroup.autor}>
                    <AuthorHeader>
                      <AuthorIcon>
                        <Feather size={14} />
                      </AuthorIcon>
                      <span>{authorGroup.autor}</span>
                      <AuthorCount>
                        ({authorGroup.items.length}{' '}
                        {authorGroup.items.length === 1 ? 'obra' : 'obras'})
                      </AuthorCount>
                    </AuthorHeader>

                    <CardsGrid>
                      {authorGroup.items.map((item) => (
                        <BookCard
                          key={`${item.id}-${item.livro}`}
                          item={item}
                          isAcervo={isAcervo}
                        />
                      ))}
                    </CardsGrid>
                  </AuthorBlock>
                ))}
              </AuthorGroupsWrapper>
            )}
          </CategoryBlock>
        );
      })}
    </SectionsStack>
  );
};