# BookReview

Aplicação web para criar, organizar e consultar resenhas de livros por coleções.

## Preview

![Preview da aplicação BookReview](./public/preview-readme.png)

## Sobre o projeto

O BookReview foi construído com Next.js 16 (App Router), React 19 e Prisma com PostgreSQL.

Com ele, voce consegue:

- Criar coleções para organizar as resenhas.
- Cadastrar novas resenhas com titulo, autor, coleção, nota (1-5) e descrição.
- Visualizar dashboard com indicadores e itens recentes.
- Filtrar resenhas por titulo e coleção.
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
- `/books-review` Listagem de resenhas com busca e filtro por coleção.
- `/books-review/[id]` Detalhes da resenha.
- `/new-review` Formulário de nova resenha.
- `/collections` Gestão de coleções.

## Estrutura resumida

```text
src/
	app/                 # Rotas do App Router
	api/actions/         # Server Actions (collections e reviews)
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

### Collection

- `id` (UUID)
- `title` (string)
- `createdAt`
- `updatedAt`

### Review

- `id` (UUID)
- `title` (string)
- `author` (string)
- `collectionId` (FK para Collection)
- `rating` (inteiro de 1 a 5)
- `content` (documento do editor rico, JSON no formato Tiptap/ProseMirror —
  fonte de verdade do conteúdo)
- `contentText` (texto puro derivado de `content`, usado na busca)
- `excerpt` (resumo curto derivado de `content`, usado nos cards)
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

2. Crie o arquivo `.env` na raiz do projeto (veja `.env.example` para a lista completa de variáveis):

```env
DATABASE_URL="postgresql://admin:admin@localhost:5433/bookreview"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
POSTGRES_PORT=5433
```

Se a porta `5433` já estiver em uso por outro container/processo na sua
máquina, mude `POSTGRES_PORT` (e a porta correspondente em `DATABASE_URL`)
para uma porta livre — `docker compose up -d` respeita essa variável.

3. Suba o banco com Docker (opcional, recomendado):

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

## Scripts disponíveis

- `pnpm dev` Inicia em modo desenvolvimento.
- `pnpm build` Gera build de produção.
- `pnpm start` Inicia app em produção.
- `pnpm lint` Executa o lint.
- `pnpm format` Verifica formatação.
- `pnpm format:fix` Corrige formatação.
- `pnpm validate:typecheck` Executa checagem de tipos.
- `pnpm test` Roda os testes uma vez.
- `pnpm test:watch` Roda os testes em modo watch.
- `pnpm test:coverage` Roda os testes com relatório de cobertura.
- `pnpm db:migrate:dev` Cria/aplica migrações em desenvolvimento.
- `pnpm db:migrate` Aplica migrações pendentes (`prisma migrate deploy`).
- `pnpm db:studio` Abre o Prisma Studio.

### Release e migrações

`pnpm build` **não** roda migrações — ele só gera o Prisma Client e compila o
Next.js (`prisma generate && next build`). Rodar migração dentro do build é
perigoso quando há builds paralelos ou múltiplas réplicas disputando a mesma
migração.

Migração de banco é um passo de release separado: rode `pnpm db:migrate`
manualmente (ou como um step isolado do pipeline de deploy) antes de colocar a
nova versão em produção.

## Validacoes implementadas

- Collection:
  - Titulo obrigatório.
  - Impede duplicidade por titulo.
- Resenha:
  - Titulo, autor, coleção e conteúdo obrigatórios.
  - Nota obrigatória entre 1 e 5.
  - Conteúdo validado no servidor contra o schema do editor (nós fora da
    lista de extensões são rejeitados) e limitado a ~100KB.
  - Impede duplicidade de resenha por titulo.

## Testes

Testes automatizados (Vitest) cobrem a camada de regra de negócio
(`src/server/modules/*/*.service.ts` e `src/server/lib/rich-text.ts`) —
sem componente React, sem end-to-end. Não tocam o Postgres: os
repositories são substituídos por dublês em memória
(`*.repository.fake.ts`), tipados contra o repository real para que uma
mudança de assinatura no repository quebre a compilação do dublê em vez
de passar em silêncio.

```bash
pnpm test           # roda uma vez
pnpm test:watch      # modo watch
pnpm test:coverage   # com relatório de cobertura
```

CI (`.github/workflows/ci.yml`) roda lint, typecheck, test e build em
todo push e pull request.

## Arquitetura de dados

- As operações de escrita usam Server Actions em `src/server/actions`.
- As consultas sao feitas no servidor com Prisma.
- O cliente usa React Hook Form + Zod para validação e UX de formulário.

## Qualidade e padrão de código

- ESLint e Prettier configurados.
- TypeScript com checagem de tipos via `pnpm validate:typecheck`.
- Lefthook configurado no projeto (arquivo `lefthook.yml`).

## Possíveis melhorias

- Edição e exclusão de resenhas/coleções.
- Confirmação de exclusão e fluxo de undo.
- Paginação e ordenação da listagem.
- Autenticação de usuários.
- Testes unitários e de integração.

## Licença

Projeto para estudo e portfolio.
