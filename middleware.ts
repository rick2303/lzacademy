// middleware.ts — raíz del proyecto (mismo nivel que package.json)
import { NextRequest, NextResponse } from "next/server";

// Rutas válidas del sitio — cualquier cosa fuera de esta lista
// que no sea un archivo estático redirige al home
const VALID_ROUTES = new Set([
  "/",
  "/historia",
  "/metodo",
  "/ciencia",
  "/como-funciona",
  "/sesiones",
  "/fundacion",
  "/success",
  "/admin/dashboard",
  "/admin/login",
  // Landings por mercado
  "/mexico",
  "/colombia",
  "/latinos-usa",
  "/honduras",
]);

// Países que tienen landing propia
const COUNTRY_TO_SLUG: Record<string, string> = {
  MX: "mexico",
  CO: "colombia",
  HN: "honduras",
  US: "latinos-usa",
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") 
  ) {
    return NextResponse.next();
  }

  if (!VALID_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  if (pathname === "/") {
    const country = request.headers.get("x-vercel-ip-country") ?? "";
    const slug = COUNTRY_TO_SLUG[country];

    if (slug) {
      return NextResponse.redirect(new URL(`/${slug}`, request.url), 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
