"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "./Container";

const navItems = [
  { href: "/",              label: "Inicio" },
  { href: "/interes",       label: "Interés" },
  { href: "/historia",      label: "Historia" },
  { href: "/metodo",        label: "Método" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/fundacion",     label: "Fundación LZ" },
];

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstLinkRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="sticky top-0 z-60 bg-white border-b border-zinc-200">
      <Container>
        <div className="flex h-[68px] items-center gap-10">

          {/* ── Logo (izquierda) ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-black/8 shadow-sm">
              <Image
                src="/lzacademy_logo1.png"
                alt="LZ English Academy"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </span>
            <div className="leading-snug">
              <p className="text-[15px] font-bold text-zinc-900 tracking-tight">LZ English Academy</p>
              <p className="text-[12px] font-normal text-zinc-500">Método 590</p>
            </div>
          </Link>

          {/* ── Nav links centrados (desktop) ── */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "text-[15px] font-bold transition-colors duration-150 whitespace-nowrap",
                    isActive
                      ? "text-[#C0353E]"
                      : "text-zinc-800 hover:text-[#C0353E]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA desktop — acceso a la plataforma */}
          <div className="hidden md:flex shrink-0 w-[200px] justify-end">
            <a
              href="https://app.lainz590.com/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#C0353E] px-4 py-2 text-[13px] font-bold text-[#C0353E] transition hover:bg-[#C0353E] hover:text-white"
            >
              Acceder →
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <div className="flex md:hidden flex-1 justify-end">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 transition"
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              <IconMenu className="h-5 w-5 text-zinc-700" />
            </button>
          </div>

        </div>
      </Container>

      {/* ══════ MOBILE OVERLAY ══════ */}
      {open && (
        <div
          className="fixed inset-0 z-70 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú móvil"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/30"
          />

          {/* Panel */}
          <div className="absolute inset-x-0 top-0 bg-white border-b border-zinc-200 shadow-lg">
            <Container>
              {/* Header row */}
              <div className="flex h-[68px] items-center justify-between">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                  <span className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-black/8 shadow-sm">
                    <Image
                      src="/lzacademy_logo1.png"
                      alt="LZ English Academy"
                      fill
                      sizes="48px"
                      className="object-cover"
                      priority
                    />
                  </span>
                  <div className="leading-snug">
                    <p className="text-[15px] font-bold text-zinc-900">LZ English Academy</p>
                    <p className="text-[12px] text-zinc-500">Método 590</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 transition"
                  aria-label="Cerrar menú"
                >
                  <IconX className="h-5 w-5 text-zinc-700" />
                </button>
              </div>

              {/* Links */}
              <nav className="pb-6 pt-1 flex flex-col gap-1">
                {navItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      ref={idx === 0 ? firstLinkRef : null}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-bold transition",
                        isActive
                          ? "text-[#C0353E] bg-red-50"
                          : "text-zinc-800 hover:text-[#C0353E] hover:bg-red-50",
                      ].join(" ")}
                    >
                      {item.label}
                      <span className="text-[#C0353E] opacity-40 text-lg">›</span>
                    </Link>
                  );
                })}

                {/* CTA acceso plataforma */}
                <a
                  href="https://app.lainz590.com/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#C0353E] px-4 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#a82d35]"
                >
                  Acceder a la plataforma →
                </a>
              </nav>
            </Container>
          </div>
        </div>
      )}
    </header>
  );
}