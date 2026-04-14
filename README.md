# BookReview

Aplicação web para criar, organizar e consultar resenhas de livros por albums/categorias.

## Preview

![Preview da aplicação BookReview](./public/preview-readme.png)

## Sobre o projeto

O BookReview foi construído com Next.js 16 (App Router), React 19 e Prisma com PostgreSQL.

Com ele, voce consegue:

- Criar albums para organizar as resenhas.
- Cadastrar novas resenhas com titulo, autor, album, nota (1-5) e descrição.
- Visualizar dashboard com indicadores e itens recentes.
- Filtrar resenhas por titulo e categoria.
- Acessar pagina de detalhes de cada resenha.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- PostgreSQL
- React Hook Form + Zod
- Sonner (toasts)
- Lucide React (ícones)

## Rotas da aplicação

- `/` Dashboard com visão geral.
- `/books-review` Listagem de resenhas com busca e filtro por album.
- `/books-review/[id]` Detalhes da resenha.
- `/new-review` Formulário de nova resenha.
- `/albums` Gestão de albums.

## Estrutura resumida

```text
src/
	app/                 # Rotas do App Router
	api/actions/         # Server Actions (albums e reviews)
	template/            # Estrutura das paginas e componentes de domínio
	components/ui/       # Componentes base de interface
	lib/                 # Prisma client, utilitários e helpers
prisma/
	schema.prisma        # Modelos e datasource
	migrations/          # Histórico de migrações
public/
	preview-readme.svg   # Imagem usada neste README
```

## Modelagem de dados

### Album

- `id` (UUID)
- `title` (string)
- `createdAt`
- `updatedAt`

### Review

- `id` (UUID)
- `title` (string)
- `author` (string)
- `categoryId` (FK para Album)
- `rating` (inteiro de 1 a 5)
- `description` (máximo de 280 caracteres)
- `createdAt`
- `updatedAt`

## Requisitos

- Node.js 20+
- pnpm 10+
- PostgreSQL (local ou via Docker)

## Configuração do ambiente

1. Instale as dependências:

```bash
pnpm install
```

2. Crie o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://example:example@localhost:5432/bookreview"
```

3. Suba o banco com Docker (opcional, recomendado):

```bash
docker compose up -d
```

4. Rode as migrações do Prisma:

```bash
pnpm prisma migrate dev
```

5. Inicie o projeto:

```bash
pnpm dev
```

6. Acesse:

```text
http://localhost:3000
```

## Scripts disponíveis

- `pnpm dev` Inicia em modo desenvolvimento.
- `pnpm build` Gera build de produção.
- `pnpm start` Inicia app em produção.
- `pnpm lint` Executa o lint.
- `pnpm format` Verifica formatação.
- `pnpm format:fix` Corrige formatação.
- `pnpm validate:typecheck` Executa checagem de tipos.

## Validacoes implementadas

- Album:
  - Titulo obrigatório.
  - Impede duplicidade por titulo.
- Resenha:
  - Titulo, autor, album e texto obrigatórios.
  - Nota obrigatória entre 1 e 5.
  - Descrição com máximo de 280 caracteres.
  - Impede duplicidade de resenha por titulo.

## Arquitetura de dados

- As operações de escrita usam Server Actions em `src/api/actions`.
- As consultas sao feitas no servidor com Prisma.
- O cliente usa React Hook Form + Zod para validação e UX de formulário.

## Qualidade e padrão de código

- ESLint e Prettier configurados.
- TypeScript com checagem de tipos via `pnpm validate:typecheck`.
- Lefthook configurado no projeto (arquivo `lefthook.yml`).

## Possíveis melhorias

- Edição e exclusão de resenhas/albums.
- Confirmação de exclusão e fluxo de undo.
- Paginação e ordenação da listagem.
- Autenticação de usuários.
- Testes unitários e de integração.

## Licença

Projeto para estudo e portfolio.
