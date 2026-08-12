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

## Fases

| Fase | Escopo                                                          | Status      |
| ---- | ---------------------------------------------------------------- | ----------- |
| 1    | Correções pontuais (Toaster/CSS duplicados, Suspense, docker-compose, lefthook, nomes) | ✅ Concluída |
| 2    | Fundação de infraestrutura (ESLint/TypeScript, `env.ts`, `server-only`, scripts de release, porta do Postgres) | ✅ Concluída |
| 3    | Camadas contract / repository / service / mapper (sem Hono)      | Pendente    |
| 4    | Hono montado em `src/app/api/[[...route]]/route.ts`, route handler, middlewares, RPC | Pendente    |
| 5    | BetterAuth (email+senha, Google, GitHub)                         | Pendente    |
| 6    | Reset de senha e verificação de e-mail (opcionais)                | Pendente    |
| 7    | Rename `Album` → `Collection` / `categoryId` → `collectionId`    | Pendente    |
| 8    | Editor Tiptap (JSON, `contentText`/`excerpt` derivados)          | Pendente    |
| 9    | Migração `src/template/` → `src/features/<entidade>/`           | Pendente    |
| 10   | Testes (Vitest) e documentação OpenAPI                           | Pendente    |
