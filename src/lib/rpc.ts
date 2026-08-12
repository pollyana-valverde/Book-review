import { hc } from "hono/client";
// import type é obrigatório aqui: um import normal traria o código de
// servidor inteiro (Prisma, services) para o bundle do cliente.
import type { AppType } from "@/server/api";
import { env } from "@/lib/env";

const rpc = hc<AppType>(env.NEXT_PUBLIC_APP_URL);

export { rpc };
