# CLAUDE.md

Contexto para sessões futuras neste repositório. Leia isto inteiro antes de
mexer em qualquer coisa, e leia `docs/refactor-plan.md` para o histórico
completo das decisões e o plano de reestruturação em 10 fases (o índice de
fases no final desse documento diz o que já está concluído).

## Stack

Next.js 16 (App Router), React 19, TypeScript (fixado em `~6.0.3`, ver
"Armadilhas"), Tailwind 4, shadcn/ui, Prisma 7 + PostgreSQL, Hono +
`@hono/zod-openapi`, BetterAuth, react-hook-form + Zod 4, pnpm.

## Arquitetura em camadas

Cada domínio vive em `src/server/modules/<módulo>/`:

- **`*.contract.ts`** — schemas Zod (input e DTO de saída) e tipos inferidos.
  Zod puro, SEM import de servidor (`server-only`, `@hono/zod-openapi`, etc.)
  — o front importa daqui direto para validar formulários com `zodResolver`.
- **`*.repository.ts`** — só Prisma. Finders explícitos (`findById`,
  `findByTitle`, nunca `where: { [key]: value }` genérico), `include`
  centralizado com `satisfies Prisma.<Model>Include`.
- **`*.mapper.ts`** — converte o shape do Prisma para o DTO do contract.
- **`*.service.ts`** — regra de negócio. Normaliza filtros, lança `AppError`
  (`src/server/lib/errors.ts`) em vez de devolver `{ success, error }`.
  `userId` é sempre o primeiro parâmetro; nenhum service busca sessão
  sozinho. Nenhum `revalidatePath`/`revalidateTag` aqui.
- **`*.routes.ts`** — Hono (`createRoute` do `@hono/zod-openapi`). Só
  controller: valida, chama o service, escolhe status, dispara
  `revalidateTag`. Zero regra de negócio.
- **`*.queries.ts`** — camada de leitura cacheada para Server Components,
  embrulha o service com `unstable_cache` (ver "Cache por usuário" abaixo).
- **`*.openapi.ts`** — metadados OpenAPI (`.openapi()`), servidor-only.
  Separado do contract de propósito.

Fora dos módulos:

- **`src/server/actions/`** — Server Actions finas (a borda para quem ainda
  não migrou para RPC): chamam o service, convertem erros via
  `src/server/lib/action-result.ts`, fazem `revalidatePath`.
- **`src/server/db/prisma.ts`** — client Prisma singleton.
- **`src/server/api/index.ts`** — monta o app Hono raiz, `/api/[[...route]]`.
- **`src/lib/rpc.ts`** — cliente `hc<AppType>()` para chamadas do client-side.

**Princípio central: Server Components importam services (ou `*.queries.ts`)
diretamente. NUNCA chamam a própria API por HTTP.** Mutações do lado do
cliente vão por Hono RPC (`hc`); o que ainda não foi migrado usa Server
Action.

## As seis regras de trabalho deste projeto

1. **Não expanda o escopo.** Outros problemas encontrados durante uma tarefa
   vão para a seção "Encontrei mas não corrigi" do relatório, junto com a
   fase do plano em que se encaixam — não corrija por iniciativa própria.
2. **Não altere o escopo das fases em `docs/refactor-plan.md`.** Se uma fase
   parecer mal dividida, registre a recomendação no relatório e siga o plano
   como está.
3. **Nunca apague dados, volumes Docker ou bancos sem perguntar antes e
   receber confirmação explícita.**
4. **Um commit por tarefa, mensagens em português.**
5. **No relatório final, diga com clareza o que NÃO foi testado.** Nunca
   descreva como testado o que não foi.
6. **Quando uma instrução parecer errada ou inviável, pare e explique** em
   vez de improvisar um contorno.

## Armadilhas já descobertas (não redescubra por tentativa e erro)

- **`pnpm dev` não reflete produção**: ignora `NODE_ENV` customizado e não
  aplica cache como o build real. Qualquer teste de cache ou de gate de
  ambiente (`NODE_ENV === "production"`) exige `next build && next start`.
- **Exports agrupados quebram o parser estático do Next** (`export {
  middleware, config }`). Use exports individuais em `route.ts`, `proxy.ts`
  e afins.
- **RPC do Hono**: `.route()`/`.get()`/`.post()` precisam estar encadeados
  numa única expressão, com o tipo inferido de uma variável declarada.
  Quebrar a cadeia faz `AppType` virar `any` SEM erro de compilação.
- **`.use("*", middleware)` encadeado degrada `OpenAPIHono` para Hono puro**
  e quebra `.openapi()` das rotas seguintes na cadeia. Use o campo
  `middleware` dentro do `createRoute()` de cada rota, não `.use()`
  encadeado.
- **TypeScript fixado em `~6.0.3` e ESLint em `^9` de propósito**: nenhuma
  versão publicada de `@typescript-eslint` suporta TypeScript 7 ainda. Não
  atualize nenhum dos dois sem reler a seção de infraestrutura em
  `docs/refactor-plan.md`.
- **`*.contract.ts` são neutros** (Zod puro, sem imports de servidor) porque
  o front os importa. Metadados OpenAPI (`.openapi()`) ficam em
  `*.openapi.ts`, servidor-only.
- **`unstable_cache` está deprecated** mas é o que o projeto usa hoje;
  migrar para `"use cache"`/Cache Components é dívida técnica registrada,
  não é para fazer sem pedido explícito.
- **Cache por usuário é a parte crítica**: a CHAVE do `unstable_cache` (não
  só a tag) precisa incluir `userId`, senão dados vazam entre contas. Cada
  função de `*.queries.ts` recebe `userId` e embrulha `unstable_cache`
  DENTRO da função chamada com esse `userId` em mãos — nunca um wrapper
  único criado uma vez no carregamento do módulo.
- **Teste de tipo do RPC** (`src/lib/rpc.type-test.ts`) só vale se for
  FALSIFICADO: quebre de propósito, confirme que `tsc` acusa o erro,
  restaure.

## Padrão de formulário

`useForm` direto do react-hook-form + `zodResolver` sobre o schema do
`*.contract.ts`. **Não use `<Form>`/`<FormField>` do shadcn** — use
`register`, e os componentes `Field`/`FieldLabel`/`FieldError`/`Input`
"crus" de `src/components/ui/`. Erro vindo do servidor entra em
`setError("root", { message })` e é exibido via `FieldError`. Após sucesso
de uma mutação via RPC, chame `router.refresh()` para repintar os Server
Components depois do `revalidateTag`.

## Mais contexto

`docs/refactor-plan.md` tem o histórico completo: decisões de domínio e
infraestrutura, dívida técnica, e o status fase a fase (1 a 6 concluídas;
7 a 10 pendentes no momento em que este arquivo foi escrito).
