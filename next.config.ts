import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Desativa a geração automática de AGENTS.md/CLAUDE.md pelo `next dev`
  // (Next 16.3+) — mantemos nosso próprio CLAUDE.md versionado.
  agentRules: false,
};

export default nextConfig;
