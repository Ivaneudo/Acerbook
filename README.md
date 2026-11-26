# 📚 Acerbook — Biblioteca Pessoal & Controle de Leitura

Aplicação web moderna e responsiva para gerenciamento, catalogação e visualização de uma **Biblioteca Pessoal & Controle de Leitura**, construída com **React, TypeScript, Vite e Emotion (`@emotion/react` / `@emotion/styled`)**.

O projeto utiliza um **banco de dados em JSON** (`src/data/db/*.json`) organizado por coleção e agrupado por categorias, transformando listas de leitura em um painel interativo com métricas dinâmicas, cálculo de tempo de leitura, busca instantânea sem acentos, filtros inteligentes e alternância de tema claro/escuro.

---

## ✨ Funcionalidades Principais

- **4 Visões Especializadas (`src/data/db/`):**
  - **Meu Acervo (`acervo.json`):** livros em posse com data de início, data final, cálculo automático de dias de leitura, tentativas e badge de status (*Concluído*, *Lendo* ou *Não iniciado*).
  - **Livros Lidos (`lidos.json`):** histórico completo das obras já concluídas.
  - **Para Ler (`para_ler.json`):** fila/wishlist de próximas leituras.
  - **Lista de Compras (`para_comprar.json`):** livros já lidos que ainda faltam no acervo pessoal.
- **Dashboard de KPIs em Tempo Real:**
  - Totais de cada lista, **percentual de livros do acervo já concluídos** e **Tempo de Leitura** (*somatória total de dias lidos e média por livro*).
- **Busca e Filtros Inteligentes:**
  - Pesquisa instantânea ignorando acentos e maiúsculas/minúsculas.
  - Chips interativos de categoria com contagem e filtro por autor.
  - Agrupamento automático por **Categoria → Autor**, alternável entre **Cards (Grid responsivo)** e **Tabela compacta**.
- **Tema Escuro & Claro:**
  - *Obsidian & Crimson* (Dark) e *Porcelain & Crisp White* (Light), com detecção automática (`prefers-color-scheme`) e persistência no `localStorage`.
- **Formulário de Cadastro/Edição (Local) & Exportação JSON:**
  - Em ambiente local, permite adicionar, editar e remover livros via formulário e exportar o arquivo `.json` atualizado pronto para o banco em `src/data/db/`.

---

## 🔒 Comportamento em Produção vs. Ambiente Local

Como esta aplicação é publicada como uma vitrine pública **sem sistema de login ou autenticação**:

- **Em Produção (`npm run build`):** o formulário de cadastro/edição fica **automaticamente desativado** para preservar os dados oficiais do repositório. Ao clicar em **Adicionar Livro**, um modal customizado é exibido explicando o motivo e mostrando como rodar localmente com sua própria base JSON. O botão **Exportar JSON** continua disponível em modo somente leitura.
- **Em Desenvolvimento Local (`npm run dev`):** o botão **Adicionar Livro** abre o formulário completo para cadastrar novos livros (e habilita editar/excluir diretamente nos cards e na tabela), salvando no `localStorage` e permitindo exportar o `.json` atualizado.

---

## 🚀 Como Rodar Localmente e Montar Sua Própria Biblioteca

### Pré-requisitos
- **Node.js** 18+ e **npm** instalados.

### Passo a passo

1. Clone este repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/Ivaneudo/Acerbook.git
cd Acerbook
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

## 🗄️ Estrutura do Banco de Dados JSON

Os dados ficam organizados na pasta `src/data/db/` em 4 arquivos agrupados por categoria:

- `src/data/db/acervo.json`
- `src/data/db/lidos.json`
- `src/data/db/para_ler.json`
- `src/data/db/para_comprar.json`

### Como atualizar os dados

1. **Via Formulário (recomendado no dia a dia):** rodando `npm run dev`, adicione ou edite livros pelo botão **Adicionar Livro** (ou ícones nos cards) e clique em **Exportar JSON** para baixar o arquivo `.json` atualizado e substituir em `src/data/db/`.
2. **Editando diretamente:** basta alterar os arquivos em `src/data/db/` seguindo o formato:

```json
{
  "colecao": "acervo",
  "categorias": [
    {
      "categoria": "Literatura Brasileira / Clássicos",
      "livros": [
        {
          "id": 1,
          "autor": "Clarice Lispector",
          "livro": "A paixão segundo G.H",
          "dataInicio": "17/12/2025",
          "dataFinal": "13/02/2026",
          "tentativas": "1"
        }
      ]
    }
  ]
}
```

> Use o formato `DD/MM/AAAA` em `dataInicio` e `dataFinal` no `acervo.json` para que o cálculo de dias e o KPI **Tempo de Leitura** funcionem automaticamente.

---

## 🛠️ Stack & Arquitetura

- **Core:** React + TypeScript + Vite
- **Estilização:** `@emotion/react` + `@emotion/styled` (**zero arquivos `.css`**)
- **Ícones:** `lucide-react` e SVGs inline
- **Tipografia:** `JetBrains Mono` (display/títulos) e `Inter` (corpo)
- **Padrão de Componentes:** `NomeDoComponente.tsx` (lógica e JSX) + `NomeDoComponente.styles.ts` (Emotion com `shouldForwardProp`)

---

## 📦 Build de Produção

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