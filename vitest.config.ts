import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      // `server-only` lança um erro incondicional fora do bundler do
      // Next — ver src/test/stubs/server-only.ts para o motivo completo.
      "server-only": path.resolve(
        import.meta.dirname,
        "src/test/stubs/server-only.ts"
      ),
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    // Testes de service não precisam de DOM — não tocam Postgres nem
    // React. "node" evita o custo (e a tentação) de simular um browser
    // aqui; testes de componente são explicitamente fora de escopo desta
    // fase.
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/server/modules/**/*.service.ts", "src/server/lib/rich-text.ts"],
    },
  },
});
