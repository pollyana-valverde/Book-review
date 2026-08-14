// Stub para o pacote `server-only`, usado por vitest.config.ts.
//
// `server-only` (node_modules/server-only/index.js) lança um erro
// incondicional quando importado fora do bundler do Next — é um marcador
// que o webpack do Next entende de forma especial, não um módulo real.
// Fora desse contexto (aqui, rodando sob Node via Vitest) ele quebraria a
// importação de todo `*.service.ts`/`*.repository.ts`/etc. que declara
// `import "server-only"` no topo. Este stub substitui o pacote por um
// módulo vazio só para os testes — não afeta o build do Next, que continua
// resolvendo o pacote real.
export {};
