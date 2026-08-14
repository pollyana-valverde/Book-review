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

## Arquitetura de front: features (fase 11)

O front vive em `src/features/<entidade>/`, uma pasta por entidade de
domínio (`reviews`, `collections`, `home`, `auth`). `src/template/` não
existe mais — foi a estrutura anterior à fase 11, hoje só um nome a evitar.
`src/features/auth/` (criada na fase 5) é o modelo original desse padrão.

Estrutura por dentro de cada feature:

- **`components/`** — peças de UI (client ou server) que recebem dado via
  prop, sem buscar dado do servidor por conta própria. Uma pasta por
  componente, com `index.tsx` re-exportando.
- **`http/`** — o que fala com o servidor: Server Components que chamam
  `getSession()` + `*.queries.ts` diretamente (os pontos de entrada
  usados por `src/app/*/page.tsx`/`loading.tsx`), e funções de busca de
  dado puras (ex.: `home/http/resume-data.ts`). Mutação do lado do
  cliente (RPC) fica dentro do componente que a dispara (`components/`),
  não vira uma função separada em `http/` — não extraia lógica de dentro
  de um componente só para encaixar na convenção de pasta.
- **`lib/`** — utilidade específica da feature (ex.:
  `reviews/lib/search-params.ts`).
- **`types/`** — tipos específicos da feature que não vêm direto de um
  `*.contract.ts`.
- **`index.ts`** — a API pública. Só o que é consumido de fora da feature
  (por `src/app/` ou por outra feature) precisa estar aqui.

**Três regras que fazem essa organização sobreviver ao tempo:**

1. **Uma feature NUNCA importa caminho profundo de outra feature.** Se
   `home` precisa de `ReviewCard` (de `reviews`), importa de
   `@/features/reviews` (o `index.ts`), nunca de
   `@/features/reviews/components/review-card`. Sem isso, mudar um
   detalhe interno de uma feature quebra outra em silêncio.
   `grep -rn "@/features/[a-z]*/" src/features/` só deve mostrar imports
   DENTRO da própria feature — é o teste rápido pra verificar isso.
2. **`index.ts` exporta só o que é público.** O resto é detalhe interno,
   mesmo que tecnicamente importável por caminho profundo (TypeScript não
   impede isso — é convenção, não hard rule).
3. **`src/app/` continua sem lógica própria**, só compõe o que as
   features exportam. Regra herdada da fase 3: Client Component nunca
   importa nada de `src/server/` (o `server-only` de cada módulo já
   quebra isso em build, não é opcional).

**Componente genuinamente compartilhado (usado por mais de uma feature em
pé de igualdade, ou consumido também por `src/server/`) vai para
`src/components/`, não para uma feature arbitrária.** É o caso de
`src/components/ui/` (shadcn) e `src/components/editor/` — este último
especificamente porque `src/server/lib/rich-text.ts` importa
`extensions.ts` de lá; se `editor/` morasse dentro de `features/reviews/`,
o servidor estaria importando de dentro de uma feature de front, invertendo
a direção de dependência.

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
- **Tags de cache com dependência cruzada entre entidades nunca devem ser
  listadas à mão em cada rota — centralize.** Bug real da fase 10: a
  contagem de resenhas por coleção (`collection.service.
  listWithReviewCount`, cacheada sob `collections:${userId}`) lê dados de
  Review através de uma relação, mas mutação de review só invalidava
  `reviews:${userId}` — a contagem ficava presa até o servidor reiniciar.
  Corrigido com `tagsForReviewMutation(userId, reviewId?)` em
  `src/server/lib/cache-tags.ts`, que toda rota/action de mutação de
  review chama em vez de montar a lista de tags na mão. Ao criar uma
  query cacheada nova que lê dados de mais de uma entidade, pergunte
  sempre: "que mutações em OUTRAS entidades deveriam invalidar isto?" —
  e centralize a resposta em `cache-tags.ts`, não em cada chamador.

## Editor rico (Tiptap)

- **JSON é a fonte de verdade.** `Review.content` guarda o documento
  Tiptap/ProseMirror como `Json`. Nunca salve HTML vindo do cliente: é
  vetor de XSS e perde a capacidade de reeditar sem parse.
- **`contentText` (texto puro, para busca) e `excerpt` (resumo para os
  cards) são SEMPRE derivados no servidor** a partir de `content` — o
  cliente nunca os envia, e mesmo que envie, o service ignora (os schemas
  de entrada não declaram esses campos).
- **`src/components/editor/extensions.ts` é compartilhado entre cliente e
  servidor de propósito** (sem `server-only`, sem import de servidor): é o
  que garante que validação (`src/server/lib/rich-text.ts`), renderização
  estática (`rich-text-content.tsx`) e o editor (`rich-text-editor.tsx`)
  usem exatamente o mesmo conjunto de nós/marcas.
- **A validação de verdade não é Zod.** O contract só confirma que
  `content` parece um documento (`type: "doc"` + `content` opcional). Quem
  valida de fato é `sanitizeRichText` (`src/server/lib/rich-text.ts`),
  reconstruindo a árvore com `Node.fromJSON(schema, json)` + `.check()`
  contra o schema derivado de `extensions.ts` — nós fora da lista não
  sobrevivem.

## Padrão de formulário

`useForm` direto do react-hook-form + `zodResolver` sobre o schema do
`*.contract.ts`. **Não use `<Form>`/`<FormField>` do shadcn** — use
`register`, e os componentes `Field`/`FieldLabel`/`FieldError`/`Input`
"crus" de `src/components/ui/`. Erro vindo do servidor entra em
`setError("root", { message })` e é exibido via `FieldError`. Após sucesso
de uma mutação via RPC, chame `router.refresh()` para repintar os Server
Components depois do `revalidateTag`.

## Padrões de UI (fase 9)

- **Seleção única (rating, coleção, e futuros casos parecidos) usa
  `radiogroup`**, não `onClick` em ícone/badge. `src/components/ui/
  radio-group.tsx` (wrapper sobre o primitivo `RadioGroup` do pacote
  `radix-ui`, já instalado — mesmo padrão de `select.tsx`/
  `alert-dialog.tsx`) dá de graça `role="radiogroup"`/`role="radio"`,
  `aria-checked`, roving tabindex (Tab entra/sai do grupo uma vez, setas
  movem E selecionam) e foco visível. Para reaproveitar um visual
  existente (badge, ícone), use `RadioGroupItem asChild` envolvendo o
  componente — não reimplemente a interação do zero.
- **Todo elemento clicável só com ícone precisa ser um `<button>` real**,
  nunca um `<svg>`/`<div>` com `onClick`. Um SVG ou div com `onClick` não
  é focável nem responde a Enter/Espaço — bug real encontrado na fase 9
  (gatilho de deletar e botão de limpar busca). Sempre `aria-label`
  descritivo, e se o elemento só aparece com `opacity-0 group-hover:
  opacity-100`, adicione `focus-visible:opacity-100` também — senão o
  foco de teclado chega num elemento invisível.
- **Busca com filtro na URL: `router.replace` (nunca `push`) com `scroll:
  false`**, input não-controlado (`defaultValue` + `ref`, não `value`
  lido de volta do `searchParams`) para não travar a digitação, e
  debounce curto (~300ms) antes de navegar. `useTransition` para um
  indicador sutil de carregamento.
- **Confirmação antes de ação destrutiva usa `alert-dialog`**
  (`src/components/ui/alert-dialog.tsx`), nunca `window.confirm` nem
  exclusão direta no clique.
- **Cores hardcoded (`bg-white`, `text-red-700`, etc.) quebram o tema
  escuro.** Use os tokens (`bg-background`, `text-destructive`,
  `dark:hover:bg-destructive/20`) definidos em `src/styles/globals.css`.
- **`error.tsx`/`loading.tsx` por segmento de rota**: mensagem de erro
  sempre genérica em português (nunca `error.message` na tela, só
  `console.error`), com botão que chama `reset()`. `loading.tsx`
  reaproveita os componentes `*-skeleton` já existentes em vez de criar
  um novo por rota.
- **Estados vazios usam `src/components/ui/empty-state.tsx`** (ícone +
  título + descrição + ação opcional), não `<h2>`/`<p>` soltos. Só
  inclua uma ação (`action={{ label, href }}`) quando não houver um botão
  equivalente já visível na mesma tela.

## Testes (Vitest)

- **Rodar**: `pnpm test` (uma vez), `pnpm test:watch` (modo watch),
  `pnpm test:coverage` (com relatório de cobertura). Não precisam do
  Postgres rodando — `docker compose stop` antes de `pnpm test` é a forma
  de provar isso.
- **Onde ficam**: `*.test.ts` ao lado do arquivo testado (ex.:
  `review.service.ts` → `review.service.test.ts`, no mesmo diretório).
  Escopo desta fase é só a camada de `*.service.ts` (regra de negócio) e
  `src/server/lib/rich-text.ts` — nada de componente React, nada de
  end-to-end.
- **Todo service novo nasce com teste.** Cubra REGRAS (o que decide um
  resultado diferente: erros lançados, branches, invariantes de
  ownership), nunca getters triviais (função que só repassa o resultado
  do repository, sem nenhum `if`) nem mapper (converter shape é fato, não
  decisão) nem repository (seria testar o Prisma).
- **Estratégia de dublê**: os services importam repository como módulo
  inteiro (`import * as reviewRepository from "..."`), então o teste usa
  `vi.mock(caminhoReal, () => import(caminhoMock))` para trocar esse
  import por um dublê em memória — não por injeção de dependência
  explícita (mudaria a assinatura pública de todo service e obrigaria
  editar todos os chamadores em produção só para viabilizar teste).
  - `*.repository.fake.ts` — a implementação em memória, tipada contra
    `typeof <módulo real>` (`import type`, nunca importa o módulo real em
    runtime — puxaria `src/server/db/prisma.ts` e por tabela
    `env.DATABASE_URL`). Se o repository real mudar de forma, o dublê
    para de compilar.
  - `*.repository.mock.ts` — o módulo-alvo do `vi.mock` (existe só
    porque a factory do `vi.mock` não pode referenciar variáveis
    externas livremente; um arquivo de verdade contorna essa restrição
    de hoisting). Nunca importado por código de produção.
  - `src/server/test-support/fake-db.ts` +
    `fake-db-instance.ts` — o "banco" em memória, compartilhado entre os
    dois dublês (Collection e Review na mesma estrutura, porque a
    restrição de FK e a contagem de resenhas por coleção atravessam as
    duas entidades no banco real também).
  - **A tipagem do dublê só protege se for falsificada**: renomeie ou
    remova um método do repository real, confirme que `tsc` acusa erro
    no dublê, restaure. Mesma técnica do teste de tipo do RPC.
  - **`pnpm test` sozinho não pega dublê desalinhado** — só roda esbuild
    (sem checagem de tipos). É `pnpm validate:typecheck` que protege
    contra o dublê ter ficado para trás; por isso o CI roda os dois.

## Mais contexto

`docs/refactor-plan.md` tem o histórico completo: decisões de domínio e
infraestrutura, dívida técnica, e o status fase a fase (1 a 10
concluídas; fase 11 — migração `src/template/` → `src/features/`,
remanejada da fase 9 original — pendente no momento em que este arquivo
foi escrito).
