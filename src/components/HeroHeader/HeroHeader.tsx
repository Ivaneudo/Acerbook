import React from 'react';
import { Terminal } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { LibraryTab } from '../../types/book';
import {
  EyebrowTag,
  HeroHighlight,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
} from './HeroHeader.styles';

const TAB_DESCRIPTIONS: Record<LibraryTab, { badge: string; title: string; subtitle: string }> = {
  acervo: {
    badge: 'acervo.json',
    title: 'Meu Acervo Pessoal',
    subtitle:
      'Livros físicos e digitais já catalogados em casa, com datas de início, conclusão, tempo de leitura e tentativas.',
  },
  lidos: {
    badge: 'lidos.json',
    title: 'Histórico de Livros Lidos',
    subtitle:
      'Registro completo das obras concluídas até aqui, organizadas por categoria literária e agrupadas por autor.',
  },
  para_ler: {
    badge: 'para_ler.json',
    title: 'Wishlist & Fila de Leitura',
    subtitle:
      'Próximas leituras planejadas — de clássicos brasileiros e filosofia até séries de aventura e ficção contemporânea.',
  },
  para_comprar: {
    badge: 'para_comprar.json',
    title: 'Lista de Compras para o Acervo',
    subtitle:
      'Obras que já foram lidas, mas ainda faltam na estante física para completar a coleção pessoal.',
  },
};

export const HeroHeader: React.FC = () => {
  const { activeTab } = useLibrary();
  const info = TAB_DESCRIPTIONS[activeTab];

  return (
    <HeroSection>
      <EyebrowTag>
        <Terminal size={13} />
        acerbook / db / biblioteca.json • {activeTab}
      </EyebrowTag>
      <HeroTitle>
        {info.title.split(' ').slice(0, -1).join(' ')}{' '}
        <HeroHighlight>{info.title.split(' ').slice(-1)}</HeroHighlight>
      </HeroTitle>
      <HeroSubtitle>{info.subtitle}</HeroSubtitle>
    </HeroSection>
  );
};