import { NextRequest, NextResponse } from "next/server";

const VALID_ROUTES = new Set([
  "/",
  "/historia",
  "/interes",
  "/metodo",
  "/ciencia",
  "/como-funciona",
  "/sesiones",
  "/fundacion",
  "/success",
  "/admin/dashboard",
  "/admin/interes",
  "/admin/recurrentes",
  "/admin/fechas",
  "/admin/contenido",
  "/admin/login",
  "/admin/busqueda",
  "/pasouno",      
  "/pasodos",
  "/essential",
  "/premium",
  "/personalizada", 
]);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!VALID_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
