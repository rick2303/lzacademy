import { NextRequest, NextResponse } from "next/server";

const COUNTRY_TO_SLUG: Record<string, string> = {
  MX: "mexico",
  CO: "colombia",
  HN: "honduras",
  US: "latinos-usa",
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo actúa en la raíz "/"
  if (pathname !== "/") return NextResponse.next();

  const country = request.headers.get("x-vercel-ip-country") ?? "";
  // Para pruebas
  // const country = "CO";
  const slug = COUNTRY_TO_SLUG[country];

  if (slug) {
    return NextResponse.redirect(new URL(`/${slug}`, request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
