# Plano de reestruturação

Este documento registra as decisões da reestruturação em 10 PRs para que
sessões futuras tenham contexto sem depender do histórico do chat.

## Decisões de domínio e arquitetura

- **Domínio**: `Album` será renomeado para `Collection`, e `categoryId` para
  `collectionId`, em schema, DTOs, rotas e UI (PR 7).
- **API**: Hono montado em `src/app/api/[[...route]]/route.ts`, com camadas
  contract / routes / service / repository / mapper em
  `src/server/modules/`. Server Components importam services diretamente;
  NUNCA chamam a própria API por HTTP. Mutações do cliente vão por Hono RPC
  (`hc`).
- **Auth**: BetterAuth com email+senha, Google e GitHub. Reset de senha e
  verificação de e-mail são OPCIONAIS (opt-in do usuário, como segunda
  etapa; não bloqueiam o primeiro login).
- **Editor**: Tiptap, JSON como fonte de verdade, com `contentText` e
  `excerpt` derivados no servidor.
- **Front**: `src/template/` vira `src/features/<entidade>/`.
- **Testes**: Vitest nos services, com repositories falsos.
- **Docs**: OpenAPI via `@hono/zod-openapi`.

## Decisões de infraestrutura (fase 2)

- **TypeScript e ESLint travados em versões estáveis, não nas mais novas.**
  `typescript@^7` quebrava `pnpm lint` (`TypeError: Cannot read properties of
  undefined (reading 'Cjs')` em `@typescript-eslint/typescript-estree`), e
  depois de corrigir isso, `eslint@^10` quebrava de novo
  (`react/display-name` lançando `contextOrFilename.getFilename is not a
  function`).
  - `@typescript-eslint/typescript-estree` (última versão publicada,
    8.67.0) declara `peerDependencies.typescript: ">=4.8.4 <6.1.0"` — não
    existe hoje nenhuma versão de `@typescript-eslint` que suporte
    TypeScript 7.
  - `eslint-plugin-react` (última versão publicada, 7.37.5, trazida pelo
    `eslint-config-next@16.3.0`) declara `peerDependencies.eslint` até
    `^9.7` — ESLint 10 ainda não é suportado pelo plugin.
  - `prisma@7.9.1` e `@hookform/resolvers` (via `valibot`) só exigem
    `typescript >=5.4.0` / `>=5`, então travar o TypeScript numa faixa
    5.x/6.x não quebra nenhuma outra dependência.
  - **Decisão**: `typescript` fixado em `~6.0.3` (a única faixa 6.x
    publicada, já que o TypeScript pulou de `6.0.3` direto para `7.0.x`) e
    `eslint` fixado em `^9`. Reavaliar quando `@typescript-eslint` e
    `eslint-plugin-react`/`eslint-config-next` publicarem suporte oficial a
    TypeScript 7 e ESLint 10 — não fazer upgrade "no escuro" antes disso.

## Dívida técnica

- TypeScript fixado em `~6.0.3` e ESLint em `^9` porque nenhuma versão
  publicada de `@typescript-eslint` suporta TypeScript 7. Revisitar quando
  houver suporte.

## Camadas de servidor (fase 3)

Uma pasta por módulo em `src/server/modules/<módulo>/`, sem Hono ainda
(fase 4 monta o transporte por cima disso):

- **`*.contract.ts`** — schemas Zod (input e DTO de saída) e os tipos
  inferidos. Sem `import "server-only"`: o front importa daqui para validar
  formulários com `zodResolver`.
- **`*.repository.ts`** — só Prisma. Finders explícitos (`findById`,
  `findByTitle`, nunca `where: { [key]: value }`), `include` centralizado
  com `satisfies Prisma.<Model>Include`, e `findMany` já preparado para
  paginação por cursor (`cursor`/`limit`, busca `limit + 1`) — a UI ainda usa
  só o default.
- **`*.mapper.ts`** — converte o shape do Prisma para o DTO do contract.
- **`*.service.ts`** — regra de negócio: normaliza filtros (`category ===
  "all"` vira `undefined` aqui, não no componente), lança `AppError`
  (`src/server/lib/errors.ts`) em vez de devolver `{ success, error }`, e
  troca o padrão check-then-create por confiar na unique constraint e tratar
  o `P2002` do Prisma. Nenhum `revalidatePath` aqui.
- **`src/server/actions/`** — a borda: Server Actions finas que chamam o
  service, convertem `AppError`/`ZodError` para `{ success, error }` via
  `src/server/lib/action-result.ts`, e fazem `revalidatePath` usando a lista
  única `REVALIDATE_PATHS`. Erros que não são `AppError` são logados e viram
  mensagem genérica — nunca vazam a mensagem do Prisma.
- **`src/server/db/prisma.ts`** — client singleton (movido de `src/lib/`).

`src/api/` foi apagado por completo. Os tipos globais ambientes `Album` e
`BookReview` (`src/types/*.d.ts`) também — os componentes agora importam
`AlbumDTO`/`ReviewDTO` dos contracts.

## Transporte HTTP com Hono (fase 4)

- **Hono montado em `src/app/api/[[...route]]/route.ts`** via `handle` de
  `hono/vercel`, exportando `GET/POST/PATCH/PUT/DELETE`. Sem
  `runtime = "edge"` — o Prisma precisa do runtime Node.
- **`src/server/api/index.ts`** monta o app raiz (`.basePath("/api")`),
  registra `app.onError(errorHandler)` e compõe `/health`, `/reviews`
  (`review.routes.ts`) e `/albums` (`album.routes.ts`) numa única expressão
  encadeada — é dessa variável (`routes`) que `AppType` é inferido. Um teste
  de tipo em `src/lib/rpc.type-test.ts` prova essa inferência (ver relatório
  da fase 4 para a saída).
- **Rotas são só controller**: validam com `zValidator` + o hook
  `zodValidationHook` (padroniza o 400 no formato `{ error: { code,
  message } }`), chamam o service, escolhem status (201 no create, 204 no
  delete) e disparam `revalidateTag`. Zero regra de negócio.
- **`app.onError`** traduz `AppError` para `{ error: { code, message } }`
  com o status certo; erros desconhecidos viram 500 genérico e são
  logados. O cliente RPC não infere esse formato de erro (limitação do
  Hono) — todo chamador do RPC precisa checar `res.ok` antes de ler o corpo
  como sucesso.
- **Cache por tags**: `src/server/lib/cache-tags.ts` define `reviews`,
  `review:${id}`, `albums` e `REVALIDATE_NOW` (`{ expire: 0 }` — o Next 16
  exige um segundo argumento em `revalidateTag`; usamos expiração imediata
  em vez do `"max"` recomendado porque `"max"` dá stale-while-revalidate e
  quebraria "a lista atualiza sem reload manual"). A camada de leitura
  cacheada fica em `src/server/modules/<módulo>/*.queries.ts`
  (`review.queries.ts`, `album.queries.ts`), envolvendo os services com
  `unstable_cache` e essas tags — todos os Server Components que liam dos
  services agora leem daqui. As rotas Hono de mutação e as Server Actions
  que sobraram chamam `revalidateTag` com a mesma tag.
- **`src/lib/rpc.ts`** cria o cliente `hc<AppType>()` com
  `import type { AppType }` (import normal vazaria Prisma/services para o
  bundle do cliente) e `env.NEXT_PUBLIC_APP_URL` como base. Isso só é seguro
  porque `src/lib/env.ts` foi ajustado nesta fase: `DATABASE_URL`/`NODE_ENV`
  viraram getters avaliados só na leitura (lazy), em vez de calculados no
  carregamento do módulo — senão importar `env` num Client Component (como
  `rpc.ts`) derrubava o bundle do browser tentando validar `DATABASE_URL`.
- **Fatia vertical migrada**: `album-form.tsx` foi para o RPC (sem
  `<Form>/<FormField>` do shadcn — `useForm` + `register` + `Field`/
  `FieldLabel`/`FieldError`/`Input` puros, erro de servidor em
  `errors.root`, `router.refresh()` no sucesso para repintar os Server
  Components após o `revalidateTag`). A Server Action `createAlbum` foi
  removida por ficar sem chamador; `deleteAlbum` continua como Server
  Action.
- **`new-review-form.tsx` continua em Server Action** — a migração dele
  para RPC fica para a fase 8, junto com o editor Tiptap, para não jogar
  fora o trabalho quando o formulário for reescrito. As duas abordagens
  (RPC no álbum, Server Action na resenha) coexistindo é transitório e
  intencional.
- **OpenAPI pendente**: a escolha entre `@hono/zod-openapi` (o que o plano
  original previa) e `hono-openapi` não foi feita nesta fase — fica como um
  passo próprio dentro da fase 10.

## Fases

| Fase | Escopo                                                          | Status      |
| ---- | ---------------------------------------------------------------- | ----------- |
| 1    | Correções pontuais (Toaster/CSS duplicados, Suspense, docker-compose, lefthook, nomes) | ✅ Concluída |
| 2    | Fundação de infraestrutura (ESLint/TypeScript, `env.ts`, `server-only`, scripts de release, porta do Postgres) | ✅ Concluída |
| 3    | Camadas contract / repository / service / mapper (sem Hono)      | ✅ Concluída |
| 4    | Hono montado em `src/app/api/[[...route]]/route.ts`, route handler, middlewares, RPC | ✅ Concluída |
| 5    | BetterAuth (email+senha, Google, GitHub)                         | Pendente    |
| 6    | Reset de senha e verificação de e-mail (opcionais)                | Pendente    |
| 7    | Rename `Album` → `Collection` / `categoryId` → `collectionId`    | Pendente    |
| 8    | Editor Tiptap (JSON, `contentText`/`excerpt` derivados)          | Pendente    |
| 9    | Migração `src/template/` → `src/features/<entidade>/`           | Pendente    |
| 10   | Testes (Vitest) e documentação OpenAPI                           | Pendente    |
