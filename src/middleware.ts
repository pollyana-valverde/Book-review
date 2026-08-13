// Checagem OTIMISTA, não autorização: só olha se existe um cookie de sessão
// para evitar o flash de uma tela protegida antes do redirect. Não valida
// se a sessão é de fato válida no servidor — isso é caro (bateria no banco)
// e o middleware roda em runtime restrito (Edge-like): NUNCA use Prisma
// aqui. A verificação real acontece em src/server/auth/session.ts
// (requireSession, chamado pelo layout (app)) e, na fase 6, dentro dos
// services quando ownership existir.
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

const config = {
  matcher: [
    "/((?!api|sign-in|sign-up|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

export { middleware, config };
