"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "./Container";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/historia", label: "Historia" },
  { href: "/metodo", label: "Método" },
  { href: "/ciencia", label: "Ciencia" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/fundacion", label: "Fundación LZ" },
];


function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6l-12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC cierra
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Bloquea scroll + focus inicial
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstLinkRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-60 border-b border-falu-red-200/50 bg-white/85 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5">
              <Image
                src="/lzacademy_logo1.png"
                alt="LZ English Academy"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </span>

            <div className="leading-tight">
              <p className="text-sm font-semibold text-zinc-900">
                LZ English Academy
              </p>
              <p className="text-xs text-zinc-600">Método 590</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="text-sm font-medium text-zinc-700 hover:text-falu-red-800 transition"
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/metodo"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition sm:inline-flex"
            >
              Ver detalles
            </Link>

            <a
              href="/#planes"
              className="hidden sm:inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition shadow-sm"
            >
              Inscribirme
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition md:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              <IconMenu className="h-5 w-5 text-falu-red-900" />
            </button>
          </div>
        </div>
      </Container>

      {/* MOBILE OVERLAY */}
      {open ? (
        <div
          className="fixed inset-0 z-70 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú móvil"
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Panel */}
          <div className="absolute inset-x-0 top-0">
            <div className="mx-auto w-full max-w-3xl">
              <div className="relative overflow-hidden border-b border-falu-red-200 bg-white shadow-xl">
                {/* Fondo suave rojo */}
                <div className="absolute inset-0 bg-linear-to-b from-falu-red-50 via-white to-white" />
                <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-falu-red-300/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-falu-red-300/10 blur-3xl" />

                <Container>
                  {/* header del menú */}
                  <div className="relative flex h-16 items-center justify-between">
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3"
                    >
                      <span className="relative h-10 w-10 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5">
                        <Image
                          src="/lzacademy_logo1.png"
                          alt="LZ English Academy"
                          fill
                          sizes="40px"
                          className="object-cover"
                          priority
                        />
                      </span>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-zinc-900">
                          LZ English Academy
                        </p>
                        <p className="text-xs text-zinc-600">Método 590</p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                      aria-label="Cerrar menú"
                    >
                      <IconX className="h-5 w-5 text-falu-red-900" />
                    </button>
                  </div>

                  {/* body */}
                  <div className="relative pb-8 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Navegación
                    </p>

                    <div className="mt-4 space-y-3">
                      {navItems.map((i, idx) => (
                        <Link
                          key={i.href}
                          href={i.href}
                          ref={idx === 0 ? firstLinkRef : null}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-2xl px-5 py-4 bg-white ring-1 ring-inset ring-falu-red-200/60 hover:bg-falu-red-50 transition"
                        >
                          <span className="text-lg font-extrabold text-zinc-900">
                            {i.label}
                          </span>
                          <span className="text-base font-semibold text-falu-red-700">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-3">
                      <a
                        href="/#form"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center justify-center rounded-2xl px-5 py-4 text-base font-extrabold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition shadow-sm"
                      >
                        Inscribirme
                      </a>

                      <Link
                        href="/metodo"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center justify-center rounded-2xl px-5 py-4 text-base font-extrabold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                      >
                        Ver detalles del método
                      </Link>
                    </div>

                    <p className="mt-8 text-xs text-zinc-500">
                      © {new Date().getFullYear()} LZ English Academy
                    </p>
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
