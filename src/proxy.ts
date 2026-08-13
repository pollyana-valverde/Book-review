// Checagem OTIMISTA, não autorização: só olha se existe um cookie de sessão
// para evitar o flash de uma tela protegida antes do redirect. Não valida
// se a sessão é de fato válida no servidor — isso bateria no banco a cada
// navegação. A partir do Next 16, o Proxy roda no runtime Node.js por
// padrão (não é mais Edge), mas mesmo assim NUNCA use Prisma aqui: a
// verificação real acontece em src/server/auth/session.ts (requireSession,
// chamado pelo layout (app)) e, nesta fase, dentro dos services via
// requireAuth.
//
// Também grava o pathname atual num header (x-pathname) para
// requireSession() conseguir montar o callbackUrl no caso raro em que o
// cookie existe mas a sessão não é mais válida no servidor.
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const currentPath = request.nextUrl.pathname + request.nextUrl.search;

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", currentPath);
    return NextResponse.redirect(signInUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", currentPath);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!api|sign-in|sign-up|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
