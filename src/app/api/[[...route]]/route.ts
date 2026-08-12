import { handle } from "hono/vercel";
import { app } from "@/server/api";

// Sem `export const runtime = "edge"`: o Prisma precisa do runtime Node.

const GET = handle(app);
const POST = handle(app);
const PATCH = handle(app);
const PUT = handle(app);
const DELETE = handle(app);

export { GET, POST, PATCH, PUT, DELETE };
