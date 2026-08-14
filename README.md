# BookReview

Aplicação web para criar, organizar e consultar resenhas de livros por
coleções, com login por e-mail/senha ou social (Google/GitHub).

## Preview

![Preview da aplicação BookReview](./public/preview-readme.png)

## Sobre o projeto

Com o BookReview você consegue:

- Criar coleções para organizar as resenhas.
- Cadastrar resenhas com título, autor, coleção, nota (1-5) e conteúdo em
  editor de texto rico.
- Visualizar um dashboard com indicadores e itens recentes.
- Buscar resenhas por título ou pelo texto do conteúdo, com filtro por
  coleção.
- Acessar a página de detalhes de cada resenha.

Cada conta só enxerga suas próprias coleções e resenhas.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS 4 + shadcn/ui
- Prisma 7 + PostgreSQL
- Hono + `@hono/zod-openapi` (API HTTP, montada em `/api`)
- BetterAuth (autenticação e sessão)
- React Hook Form + Zod 4
- Tiptap (editor de texto rico)
- Vitest (testes)
- pnpm

## Requisitos

- Node.js 20+
- pnpm 10+
- Docker (recomendado para o Postgres local) ou um PostgreSQL 17 já
  disponível

## Configuração do ambiente

1. Instale as dependências:

```bash
pnpm install
```

2. Crie o arquivo `.env` na raiz do projeto (veja `.env.example` para a
   lista completa de variáveis, incluindo as opcionais de login social):

```env
DATABASE_URL="postgresql://admin:admin@localhost:5433/bookreview"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
POSTGRES_PORT=5433
BETTER_AUTH_SECRET="gere com: openssl rand -base64 32"
```

Se a porta `5433` já estiver em uso por outro container/processo na sua
máquina, mude `POSTGRES_PORT` (e a porta correspondente em `DATABASE_URL`)
para uma porta livre — `docker compose up -d` respeita essa variável, e
nenhum outro arquivo precisa mudar.

3. Suba o banco com Docker:

```bash
docker compose up -d
```

4. Rode as migrações do Prisma em desenvolvimento:

```bash
pnpm db:migrate:dev
```

5. Inicie o projeto:

```bash
pnpm dev
```

6. Acesse:

```text
http://localhost:3000
```

> `pnpm dev` não reflete o comportamento de produção: ignora um `NODE_ENV`
> customizado e não aplica cache do mesmo jeito que um build real. Para
> testar cache ou qualquer comportamento condicionado a
> `NODE_ENV === "production"`, use `pnpm build && pnpm start`.

## Scripts disponíveis

| Script                    | O que faz                                                 |
| ------------------------- | --------------------------------------------------------- |
| `pnpm dev`                | Inicia em modo desenvolvimento.                           |
| `pnpm build`              | Gera build de produção (`prisma generate && next build`). |
| `pnpm start`              | Inicia o app já buildado, em produção.                    |
| `pnpm lint`               | Executa o ESLint.                                         |
| `pnpm format`             | Verifica formatação (Prettier).                           |
| `pnpm format:fix`         | Corrige formatação.                                       |
| `pnpm validate:typecheck` | Checagem de tipos (`tsc --noEmit`).                       |
| `pnpm test`               | Roda os testes uma vez.                                   |
| `pnpm test:watch`         | Roda os testes em modo watch.                             |
| `pnpm test:coverage`      | Roda os testes com relatório de cobertura.                |
| `pnpm db:migrate:dev`     | Cria/aplica migrações em desenvolvimento.                 |
| `pnpm db:migrate`         | Aplica migrações pendentes (`prisma migrate deploy`).     |
| `pnpm db:studio`          | Abre o Prisma Studio.                                     |

### Release e migrações

`pnpm build` **não** roda migrações — ele só gera o Prisma Client e compila
o Next.js. Rodar migração dentro do build é perigoso quando há builds
paralelos ou múltiplas réplicas disputando a mesma migração.

Migração de banco é um passo de release separado: rode `pnpm db:migrate`
manualmente (ou como um step isolado do pipeline de deploy) antes de
colocar a nova versão em produção.

## Arquitetura

### Servidor

Cada domínio (`reviews`, `collections`, ...) vive em
`src/server/modules/<módulo>/`, em camadas:

- **`*.contract.ts`** — schemas Zod (entrada e DTO de saída), sem import de
  servidor — o front importa daqui direto para validar formulários.
- **`*.repository.ts`** — acesso ao Prisma, com finders explícitos.
- **`*.mapper.ts`** — converte o shape do Prisma para o DTO do contract.
- **`*.service.ts`** — regra de negócio; lança `AppError` em vez de
  devolver `{ success, error }`.
- **`*.routes.ts`** — rotas Hono (`@hono/zod-openapi`): validam, chamam o
  service, escolhem status, disparam `revalidateTag`.
- **`*.queries.ts`** — leitura cacheada (`unstable_cache`) para Server
  Components.
- **`*.openapi.ts`** — metadados OpenAPI, servidor-only.

**Princípio central: Server Components importam services (ou
`*.queries.ts`) diretamente — nunca chamam a própria API por HTTP.**
Mutação do lado do cliente vai por Hono RPC (`src/lib/rpc.ts`); o que ainda
não foi migrado usa Server Action (`src/server/actions/`).

### Front

O front vive em `src/features/<entidade>/` (`reviews`, `collections`,
`home`, `auth`), uma pasta por entidade de domínio:

- **`components/`** — UI que recebe dado via prop.
- **`http/`** — pontos de entrada que chamam sessão + `*.queries.ts`
  (usados por `src/app/*/page.tsx`), e busca de dado pura.
- **`lib/`**, **`types/`** — utilidade e tipos específicos da feature.
- **`index.ts`** — API pública da feature; o resto é detalhe interno.

Uma feature nunca importa caminho profundo de outra (sempre via
`index.ts`), e `src/app/` só compõe o que as features exportam, sem lógica
própria. Componente genuinamente compartilhado entre features (ou também
usado por `src/server/`, como o editor de texto rico) vive em
`src/components/`.

### Estrutura resumida

```text
src/
  app/                 # Rotas do App Router (só composição, sem lógica)
  features/            # Front por entidade (reviews, collections, home, auth)
  server/              # Camadas de domínio (contract/repository/service/...) e Hono
  components/ui/       # Componentes base de interface (shadcn)
  components/editor/   # Editor Tiptap, compartilhado entre cliente e servidor
  lib/                 # Cliente RPC, utilitários e helpers
prisma/
  schema.prisma        # Modelos e datasource
  migrations/          # Histórico de migrações
public/
  preview-readme.png   # Imagem usada neste README
```

## Modelagem de dados

### Collection

- `id`, `title`, `userId`, `createdAt`, `updatedAt`.

### Review

- `id`, `title`, `author`, `collectionId`, `rating` (1 a 5), `userId`,
  `createdAt`, `updatedAt`.
- `content`: documento do editor rico (JSON no formato Tiptap/ProseMirror)
  — fonte de verdade do conteúdo.
- `contentText`: texto puro derivado de `content` no servidor, usado na
  busca.
- `excerpt`: resumo curto derivado de `content` no servidor, usado nos
  cards.

## Validações implementadas

- **Collection**: título obrigatório; impede duplicidade de título por
  usuário.
- **Review**: título, autor, coleção e conteúdo obrigatórios; nota entre 1
  e 5; conteúdo validado no servidor contra o schema do editor (nós fora
  da lista de extensões são rejeitados) e limitado a ~100KB; impede
  duplicidade de título por usuário.

## Testes

Testes automatizados (Vitest) cobrem a camada de regra de negócio
(`src/server/modules/*/*.service.ts`) e `src/server/lib/rich-text.ts` — sem
componente React, sem end-to-end. Não tocam o Postgres: os repositories são
substituídos por dublês em memória (`*.repository.fake.ts`), tipados contra
o repository real, então uma mudança de assinatura no repository quebra a
compilação do dublê em vez de passar em silêncio.

```bash
pnpm test           # roda uma vez
pnpm test:watch      # modo watch
pnpm test:coverage   # com relatório de cobertura
```

CI (`.github/workflows/ci.yml`) roda lint, checagem de tipos, testes e
build em todo push e pull request, com o Postgres desligado (as rotas são
todas dinâmicas, então o build não precisa de um banco real).

## API, OpenAPI e documentação interativa

A API HTTP (Hono) é montada em `/api`. Fora de produção
(`NODE_ENV !== "production"`), o schema OpenAPI fica disponível em
`/api/doc` e uma UI de referência interativa (Scalar) em `/api/reference`.
Em produção, ambas as rotas retornam 404 — a API não expõe o próprio mapa
publicamente.

## Qualidade e padrão de código

- ESLint e Prettier configurados.
- TypeScript com checagem de tipos via `pnpm validate:typecheck`.
- Lefthook configurado no projeto (arquivo `lefthook.yml`).

## Mais contexto

- [`CLAUDE.md`](./CLAUDE.md) — convenções de arquitetura e armadilhas já
  descobertas no projeto.
- [`docs/refactor-plan.md`](./docs/refactor-plan.md) — histórico de
  decisões de domínio e infraestrutura, e dívida técnica registrada.

## Licença

Projeto para estudo e portfólio.
