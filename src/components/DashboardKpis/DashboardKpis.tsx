import React from 'react';
import {
  BookMarked,
  BookOpenCheck,
  Bookmark,
  Clock,
  PieChart,
  ShoppingBag,
} from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { formatReadingDays } from '../../utils/libraryUtils';
import {
  KpiAccentValue,
  KpiCard,
  KpiHeader,
  KpiIconBox,
  KpiLabel,
  KpiMetricsGrid,
  KpiPrimaryGrid,
  KpiSubtext,
  KpiValue,
  KpiWrapper,
  ProgressFill,
  ProgressSubtext,
  ProgressTrack,
} from './DashboardKpis.styles';

export const DashboardKpis: React.FC = () => {
  const { kpis, activeTab, setActiveTab } = useLibrary();

  const avgDaysPerBook =
    kpis.booksWithDatesCount > 0
      ? Math.round(kpis.totalReadingDays / kpis.booksWithDatesCount)
      : 0;

  return (
    <KpiWrapper aria-label="Métricas da biblioteca">
      <KpiPrimaryGrid>
        <KpiCard
          active={activeTab === 'acervo'}
          clickable
          onClick={() => setActiveTab('acervo')}
        >
          <KpiHeader>
            <KpiLabel>Meu Acervo</KpiLabel>
            <KpiIconBox active={activeTab === 'acervo'}>
              <BookMarked size={16} />
            </KpiIconBox>
          </KpiHeader>
          <KpiValue>{kpis.totalAcervo}</KpiValue>
          <KpiSubtext>Livros em posse</KpiSubtext>
        </KpiCard>

        <KpiCard
          active={activeTab === 'lidos'}
          clickable
          onClick={() => setActiveTab('lidos')}
        >
          <KpiHeader>
            <KpiLabel>Livros Lidos</KpiLabel>
            <KpiIconBox active={activeTab === 'lidos'}>
              <BookOpenCheck size={16} />
            </KpiIconBox>
          </KpiHeader>
          <KpiValue>{kpis.totalLidos}</KpiValue>
          <KpiSubtext>Histórico concluído</KpiSubtext>
        </KpiCard>

        <KpiCard
          active={activeTab === 'para_ler'}
          clickable
          onClick={() => setActiveTab('para_ler')}
        >
          <KpiHeader>
            <KpiLabel>Para Ler</KpiLabel>
            <KpiIconBox active={activeTab === 'para_ler'}>
              <Bookmark size={16} />
            </KpiIconBox>
          </KpiHeader>
          <KpiValue>{kpis.totalParaLer}</KpiValue>
          <KpiSubtext>Wishlist de leitura</KpiSubtext>
        </KpiCard>

        <KpiCard
          active={activeTab === 'para_comprar'}
          clickable
          onClick={() => setActiveTab('para_comprar')}
        >
          <KpiHeader>
            <KpiLabel>Para Comprar</KpiLabel>
            <KpiIconBox active={activeTab === 'para_comprar'}>
              <ShoppingBag size={16} />
            </KpiIconBox>
          </KpiHeader>
          <KpiValue>{kpis.totalParaComprar}</KpiValue>
          <KpiSubtext>Lidos faltando no acervo</KpiSubtext>
        </KpiCard>
      </KpiPrimaryGrid>

      <KpiMetricsGrid>
        <KpiCard>
          <KpiHeader>
            <KpiLabel>Lidos no Acervo</KpiLabel>
            <KpiIconBox active>
              <PieChart size={16} />
            </KpiIconBox>
          </KpiHeader>
          <KpiValue>
            <KpiAccentValue>{kpis.acervoReadPercent}</KpiAccentValue>
          </KpiValue>
          <div>
            <ProgressSubtext>
              {kpis.acervoReadCount} de {kpis.totalAcervo} livros do acervo concluídos
              {kpis.acervoReadingCount > 0 && ` • ${kpis.acervoReadingCount} em andamento`}
            </ProgressSubtext>
            <ProgressTrack>
              <ProgressFill percent={kpis.acervoReadRatio * 100} />
            </ProgressTrack>
          </div>
        </KpiCard>

        <KpiCard>
          <KpiHeader>
            <KpiLabel>Tempo de Leitura</KpiLabel>
            <KpiIconBox active>
              <Clock size={16} />
            </KpiIconBox>
          </KpiHeader>
          <KpiValue>
            <KpiAccentValue>{formatReadingDays(kpis.totalReadingDays)}</KpiAccentValue>
          </KpiValue>
          <KpiSubtext>
            Somatória de {kpis.booksWithDatesCount} livros com datas registradas • média de{' '}
            {formatReadingDays(avgDaysPerBook)}/livro
          </KpiSubtext>
        </KpiCard>
      </KpiMetricsGrid>
    </KpiWrapper>
  );
};