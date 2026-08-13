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
  verificação de e-mail foram REMOVIDOS do escopo (decisão do usuário na
  fase 5, não "opcionais" como este documento dizia antes) — ver seção
  própria da fase 5 e "Dívida técnica".
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
- `unstable_cache` (usado em `*.queries.ts` desde a fase 4) está deprecated
  no Next 16 em favor da diretiva `"use cache"` / Cache Components — a
  própria doc do pacote (`node_modules/next/dist/docs/.../unstable_cache.md`)
  já avisa isso. Continua funcionando e foi o que a fase 4 pediu
  explicitamente; migrar para `"use cache"`/`cacheTag` é candidato a uma
  fase de manutenção futura, não decidido ainda.
- `next dev` ignora `NODE_ENV` customizado (sempre roda como development,
  mesmo passando `NODE_ENV=production pnpm dev`). Testar qualquer
  comportamento condicionado a `NODE_ENV === "production"` (gate de
  `/api/doc`/`/api/reference` na fase 4.5, rate limit e mensagens genéricas
  de auth na fase 5) exige `next build && next start`.
- **Reset de senha removido do escopo** (decisão do usuário na fase 5):
  usuários cadastrados por e-mail/senha não têm nenhum caminho de
  recuperação de conta se esquecerem a senha — só login social ou pedir
  para um admin recriar a conta manualmente no banco. Isso precisa ser
  endereçado antes do app ter usuários reais fora de teste.
- `src/middleware.ts` usa a convenção `middleware`, marcada como deprecated
  pelo Next 16 em favor de `proxy` (aviso no build: `The "middleware" file
  convention is deprecated. Please use "proxy" instead.`). Mantido como
  `middleware.ts` porque foi o nome pedido explicitamente na fase 5; migrar
  para a convenção `proxy` é candidato a uma fase de manutenção.
- **Cadastro por e-mail expõe se o e-mail já existe** (fase 5, tarefa 8):
  `POST /api/auth/sign-up/email` com um e-mail já cadastrado responde `422`
  com `{"code":"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"}` — comportamento
  padrão do BetterAuth, não alterado por decisão explícita (ver seção da
  fase 5). É um oráculo de existência de conta; mitigar exigiria
  interceptar essa resposta e mascarar, o que tem custo de UX (usuário
  não saberia por que o cadastro "falhou" silenciosamente). Decisão de
  manter ou mascarar fica para revisão futura do usuário.

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
- **OpenAPI**: decidido na fase 4.5 — ver seção própria abaixo.
- **Verificação pós-fase (fase 4.5, tarefa 0a)**: `DATABASE_URL="" pnpm
  build` continua falhando com mensagem clara mesmo com os getters lazy de
  `src/lib/env.ts`. Motivo: `src/server/db/prisma.ts` lê `env.DATABASE_URL`
  no topo do módulo (`new PrismaPg({ connectionString: env.DATABASE_URL
  })`), e toda rota coletada no build — incluindo `/api/[[...route]]` — 
  importa esse módulo transitivamente. O getter só adia a validação para o
  primeiro acesso real, e esse acesso acontece de qualquer forma durante o
  build. Não foi necessário separar `env.server.ts`/`env.client.ts`.

## OpenAPI com @hono/zod-openapi (fase 4.5)

- **Decisão**: `@hono/zod-openapi` (versão instalada: **1.5.2**). É a
  mesma lib que o plano original (linha "Docs" no topo deste documento) já
  prevesse — a preocupação histórica de que ela dependesse de uma versão de
  `@asteasolutions/zod-to-openapi` presa ao Zod 3 **não se aplica mais**:
  1.5.2 declara `peerDependencies.zod: "^4.0.0"` e usa
  `@asteasolutions/zod-to-openapi@^8.5.0`, que por sua vez também declara
  `peerDependencies.zod: "^4.0.0"`. Confirmado com `npm view` antes de
  instalar qualquer coisa, e validado com uma prova de conceito (uma rota,
  um schema Zod 4, `app.doc31()` gerando OpenAPI 3.1 válido) antes de tocar
  no app real. Nenhum downgrade de Zod foi necessário.
  - `hono-openapi` (a alternativa) não foi avaliada a fundo — não houve
    motivo para procurar alternativa depois que a verificação de
    compatibilidade deu certo de primeira.
- **Onde vivem os metadados OpenAPI**: `src/server/modules/<módulo>/
  <módulo>.openapi.ts` (`review.openapi.ts`, `album.openapi.ts`). Os
  `*.contract.ts` continuam em Zod puro, sem nenhum import de
  `@hono/zod-openapi` — o front os importa para validar formulários com
  `zodResolver`, e a extensão `.openapi()` não pode ir junto no bundle do
  cliente. Verificado (runtime e tipos) que chamar `.openapi()` num schema
  criado com `import z from "zod"` funciona desde que
  `import "@hono/zod-openapi"` (efeito colateral, sem binding) tenha
  rodado antes em algum ponto do processo — é o que cada `*.openapi.ts` faz
  no próprio topo, sem depender da ordem de import de quem o consome.
  Path params (`{id}`) e o schema de erro compartilhado
  (`src/server/api/lib/error-schema.ts`) seguem a mesma regra: ficam fora
  dos contracts.
- **Documentação**: `GET /api/doc` (OpenAPI 3.1 via `app.doc31()`) e
  `GET /api/reference` (Scalar, `@scalar/hono-api-reference`). Os dois só
  respondem quando `NODE_ENV !== "production"` — em produção devolvem 404.
  Testado com `next build && next start` (o `next dev` ignora
  `NODE_ENV` custom e sempre roda como development, então não serve para
  testar esse gate). Sem security schemes ainda — cookie de sessão é fase 5.
- **RPC (`AppType`) preservado**: `OpenAPIHono` estende `Hono`, então as
  três armadilhas da fase 4 (`.route()` encadeado, tipo inferido de uma
  variável, `.openapi()`/rotas encadeadas dentro de cada módulo) continuam
  valendo. `src/lib/rpc.type-test.ts` foi falsificado de novo depois da
  migração (trocada uma propriedade por um nome inexistente) e o `tsc`
  acusou o erro esperado; restaurado, voltou a passar limpo.

## Autenticação com BetterAuth (fase 5)

- **Escopo**: usuário, sessão, cadastro/login por e-mail+senha, login social
  (Google, GitHub condicionais), logout. `userId`/ownership em Album e
  Review, filtro por dono e autorização nos services ficam para a fase 6 —
  o banco já tem as tabelas de auth, mas os dados de domínio continuam sem
  dono nesta fase.
- **Verificação de e-mail e reset de senha foram REMOVIDOS do escopo**
  (decisão do usuário, não "opcionais" como a primeira versão deste plano
  dizia). Nenhum `sendResetPassword`/`sendVerificationEmail` foi
  configurado, nenhum provedor de e-mail foi instalado. O campo
  `emailVerified` existe na tabela `user` porque é parte do modelo base do
  BetterAuth (não dá pra tirar), mas nunca é checado — `requireEmailVerification`
  não foi setado, então nunca bloqueia login.
- **Schema gerado pela CLI oficial** (`pnpm dlx @better-auth/cli generate`),
  não escrito à mão — os nomes de campo (`session.token`, `account.providerId`
  etc.) são contratuais com a lib. Diff revisado antes de migrar: só
  adicionou `User`/`Session`/`Account`/`Verification`, nenhuma mudança em
  `Album`/`Review`, nenhuma relação nova com eles.
- **Providers sociais são condicionais em runtime, não em código**:
  `src/server/auth/providers.ts` só considera um provedor "configurado"
  quando SEU PAR completo (client id + secret) existe em `env`. O mesmo
  helper decide o que `src/server/auth/auth.ts` registra em
  `socialProviders` e o que a página de sign-in/sign-up passa como prop
  para `SocialButtons` — um botão que leva a um provedor mal configurado é
  pior que nenhum botão. Testado de ponta a ponta com as duas variáveis
  vazias (cenário real deste ambiente, sem credenciais OAuth): o app sobe,
  cadastro/login por e-mail funcionam, nenhum botão social aparece.
- **Basta bater o `basePath`**: `auth.ts` usa `basePath: "/api/auth"`, e o
  handler é montado em `src/server/api/index.ts` com
  `app.on(["POST","GET"], "/auth/*", (c) => auth.handler(c.req.raw))` —
  FORA da expressão encadeada dos `.route()` de propósito (não é
  `createRoute`, não deve compor `AppType`, não deve aparecer no cliente
  RPC nem no `/api/doc`). Confirmado com curl: `/api/doc` só lista as 4
  rotas de reviews/albums, nunca `/api/auth/*` nem `/api/me`.
- **`Set-Cookie` atravessa `handle()` de `hono/vercel` intacto** — testado
  explicitamente via curl em `POST /api/auth/sign-up/email`: chegam os dois
  cookies (`better-auth.session_token` e `better-auth.session_data`, esse
  por causa do `cookieCache` com maxAge de 5 min). Esse era o ponto do
  integração com maior risco de falhar em silêncio e não falhou.
- **`AppEnv.Variables`** deixou de ser `Record<string, never>` e ganhou
  `user`/`session` (nulável). `src/server/api/middlewares/session.ts` tem
  `sessionMiddleware` (só popula) e `requireAuth` (lança `UnauthorizedError`
  se não há usuário) — nenhum dos dois é global; aplicados só em
  `GET /api/me`, a rota de exemplo que prova o mecanismo. Rotas de
  review/album não os usam ainda.
- **Duas camadas de proteção, propósitos diferentes**:
  `src/middleware.ts` é checagem OTIMISTA (só olha se existe cookie via
  `getSessionCookie`, sem bater no banco) para evitar flash de tela
  protegida — nunca usa Prisma, roda em runtime restrito. A verificação
  REAL é `src/server/auth/session.ts::requireSession()`, chamada por
  `src/app/(app)/layout.tsx`, que de fato busca a sessão
  (`auth.api.getSession`, envolvida em `cache()` do React porque várias
  Server Components pedem a sessão na mesma renderização). O middleware
  seta `callbackUrl` com o pathname exato da requisição; o backstop do
  layout (caso raro: cookie existe mas sessão não é mais válida) redireciona
  para `/sign-in` sem `callbackUrl`, por não ter acesso fácil ao pathname a
  partir de um layout compartilhado.
- **Formulários no padrão da fase 4** (`useForm` direto, `register`,
  `Field`/`FieldLabel`/`FieldError`/`Input` puros, `errors.root` para erro
  de servidor, `autoComplete` correto). `readRpcError` (tarefa 0) não se
  aplica aqui — os formulários de auth usam `authClient` do BetterAuth
  (`{ data, error }`), não o RPC do Hono.
- **Segurança (tarefa 8)**:
  - Rate limit nativo do BetterAuth (`rateLimit: { enabled: true }` —
    por padrão só liga em produção; forçado para cobrir outros ambientes
    também). Testado: 3 tentativas de login com senha errada passam, a
    partir da 4ª a API responde `429`.
  - Login com senha errada: o BetterAuth já responde de forma genérica por
    padrão (`INVALID_EMAIL_OR_PASSWORD`, sem distinguir "senha errada" de
    "e-mail não existe"); o front força uma mensagem fixa
    ("E-mail ou senha incorretos.") de qualquer forma, ignorando o texto
    que vier da API.
  - Cadastro com e-mail duplicado: **não** é genérico por padrão — ver
    "Dívida técnica".
  - `BETTER_AUTH_SECRET` com `.min(32)` no Zod schema; testado com
    `BETTER_AUTH_SECRET` de 8 caracteres — `pnpm build` falha com mensagem
    apontando exatamente essa variável.

## Fases

| Fase | Escopo                                                          | Status      |
| ---- | ---------------------------------------------------------------- | ----------- |
| 1    | Correções pontuais (Toaster/CSS duplicados, Suspense, docker-compose, lefthook, nomes) | ✅ Concluída |
| 2    | Fundação de infraestrutura (ESLint/TypeScript, `env.ts`, `server-only`, scripts de release, porta do Postgres) | ✅ Concluída |
| 3    | Camadas contract / repository / service / mapper (sem Hono)      | ✅ Concluída |
| 4    | Hono montado em `src/app/api/[[...route]]/route.ts`, route handler, middlewares, RPC | ✅ Concluída |
| 4.5  | OpenAPI com `@hono/zod-openapi` (`createRoute`, `/api/doc`, `/api/reference`) | ✅ Concluída |
| 5    | BetterAuth (email+senha, Google, GitHub)                         | ✅ Concluída |
| 6    | Ownership: `userId` em Album/Review, filtro por dono, autorização nos services | Pendente    |
| 7    | Rename `Album` → `Collection` / `categoryId` → `collectionId`    | Pendente    |
| 8    | Editor Tiptap (JSON, `contentText`/`excerpt` derivados)          | Pendente    |
| 9    | Migração `src/template/` → `src/features/<entidade>/`           | Pendente    |
| 10   | Testes (Vitest) — a documentação OpenAPI foi adiantada para a fase 4.5 | Pendente    |
