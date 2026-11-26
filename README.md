# 📚 Acerbook — Biblioteca Pessoal & Controle de Leitura

Aplicação web moderna e responsiva para gerenciamento, catalogação e visualização de uma **Biblioteca Pessoal & Controle de Leitura**, construída com **React, TypeScript, Vite e Emotion (`@emotion/react` / `@emotion/styled`)**.

O projeto consome dados estruturados em formato CSV (`acervo.csv`, `lidos.csv`, `para_ler.csv` e `para_comprar.csv`) para transformar listas de leitura em um painel interativo com métricas dinâmicas, cálculo de tempo de leitura, busca instantânea sem acentos, filtros inteligentes e alternância de tema claro/escuro.

---

## ✨ Funcionalidades Principais

- **4 Visões Especializadas:**
  - **Meu Acervo:** livros em posse com data de início, data final, tempo de leitura em dias, número de tentativas e badge automática de status (*Concluído*, *Lendo* ou *Não iniciado*).
  - **Livros Lidos:** histórico completo das obras já concluídas.
  - **Para Ler:** fila/wishlist de próximas leituras.
  - **Lista de Compras:** livros já lidos que ainda faltam no acervo pessoal.
- **Dashboard de KPIs em Tempo Real:**
  - Totais de cada lista, cálculo dinâmico de cobertura do acervo (*percentual de livros lidos que já estão na estante*) e **Tempo de Leitura** (*somatória total de dias lidos e média por livro*).
- **Busca e Filtros Inteligentes:**
  - Pesquisa instantânea ignorando acentos e maiúsculas/minúsculas.
  - Chips interativos de categoria com contagem e filtro por autor.
  - Agrupamento automático por **Categoria → Autor**, alternável entre visualização em **Cards (Grid responsivo)** e **Tabela compacta**.
- **Tema Escuro & Claro:**
  - *Obsidian & Crimson* (Dark) e *Porcelain & Crisp White* (Light), com detecção da preferência do sistema (`prefers-color-scheme`) e persistência no `localStorage`.
- **Exportação e Importação de CSV:**
  - Permite exportar qualquer lista em `.csv` e, em ambiente local, importar novos `.csv` diretamente pela interface.

---

## 🔒 Comportamento em Produção vs. Ambiente Local

Como esta aplicação é publicada como uma vitrine pública **sem sistema de login ou autenticação**:

- **Em Produção (`npm run build`):** a customização e importação de arquivos `.csv` é **automaticamente desativada** para preservar os dados originais da biblioteca. Ao clicar em **Importar CSV**, um modal customizado é exibido explicando que o recurso está bloqueado em produção e direcionando o visitante para este repositório para rodar localmente com seus próprios arquivos CSV. A exportação (`.csv` somente leitura) continua disponível.
- **Em Desenvolvimento Local (`npm run dev`):** o recurso **Importar CSV** fica totalmente liberado, permitindo fazer upload de novos arquivos `.csv` pelo navegador (salvos no `localStorage`) ou restaurar os dados originais a qualquer momento.

---

## 🚀 Como Rodar Localmente e Usar com Seus Próprios CSVs

### Pré-requisitos
- **Node.js** 18+ e **npm** instalados.

### Passo a passo

1. Clone este repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/Ivaneudo/acerbook.git
cd acerbook
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento local:

```bash
npm run dev
```

4. Acesse no navegador o endereço exibido no terminal (geralmente `http://localhost:5173`).

---

## 📂 Como Adicionar Seus Próprios Arquivos CSV

Você tem duas formas de personalizar a biblioteca para o seu uso pessoal:

### Opção A — Pela interface (em ambiente local)
1. Rodando o projeto com `npm run dev`, clique em **Importar CSV** no topo da página.
2. Escolha a lista de destino (`acervo`, `lidos`, `para_ler` ou `para_comprar`) e selecione o seu arquivo `.csv`.
3. Os dados serão salvos automaticamente no `localStorage` do seu navegador.

### Opção B — Editando os dados padrão no código (ideal para publicar a sua própria versão)
Substitua o conteúdo das strings CSV em `src/data/booksData.ts` seguindo o formato de colunas abaixo:

- **`ACERVO_CSV` (`acervo.csv`):**
```csv
id,categoria,autor,livro,dataInicio,dataFinal,tentativas
1,Literatura Brasileira / Clássicos,Clarice Lispector,A paixão segundo G.H,17/12/2025,13/02/2026,1
```

- **`LIDOS_CSV`, `PARA_LER_CSV` e `PARA_COMPRAR_CSV`:**
```csv
id,categoria,autor,livro
1,Literatura Brasileira / Clássicos,Clarice Lispector,A Hora da Estrela
```

> **Dicas de preenchimento:**
> - Campos que contenham vírgulas no título, categoria ou nome do autor devem estar entre aspas duplas (ex.: `"Quem é você, Alasca?"`).
> - Use o formato `DD/MM/AAAA` em `dataInicio` e `dataFinal` no `acervo.csv` para que o cálculo de dias de leitura e o **Tempo de Leitura** total sejam contabilizados automaticamente.

---

## 🛠️ Stack & Arquitetura

- **Core:** React + TypeScript + Vite
- **Estilização:** `@emotion/react` + `@emotion/styled` (**zero arquivos `.css`**)
- **Ícones:** `lucide-react` e SVGs inline
- **Tipografia:** `JetBrains Mono` (display/títulos) e `Inter` (corpo)
- **Padrão de Componentes:** separação estrita `NomeDoComponente.tsx` (lógica e JSX) + `NomeDoComponente.styles.ts` (estilos Emotion com `shouldForwardProp`)

---

## 📦 Build de Produção

Para validar a tipagem e gerar o pacote otimizado para deploy (Vercel, Netlify, GitHub Pages, etc.):

```bash
npm run build
```

Para testar localmente como a aplicação se comporta no modo produção (incluindo o modal de customização desativada):

```bash
npm run build
npm run preview
```

---

## 👤 Autor

Desenvolvido por **Ivaneudo Carvalho**:

- 🌐 Portfólio: [ivaneudodev.vercel.app](https://ivaneudodev.vercel.app/)
- 💻 GitHub: [@Ivaneudo](https://github.com/Ivaneudo)
- 💼 LinkedIn: [ivaneudo-carvalho](https://www.linkedin.com/in/ivaneudo-carvalho/)
- 📸 Instagram: [@ivaneudo.dev](https://www.instagram.com/ivaneudo.dev/)