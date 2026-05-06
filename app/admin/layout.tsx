"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

const navItems = [
  { label: "Pagos", href: "/admin/dashboard" },
  { label: "Búsqueda", href: "/admin/busqueda" },
  { label: "Marketing", href: "/admin/marketing" },
  { label: "Usuarios recurrentes", href: "/admin/recurrentes" },
  { label: "Fechas de inicio", href: "/admin/fechas" },
  { label: "Contenido", href: "/admin/contenido" },
  { label: "Premium · Agenda", href: "/admin/premium-agenda" },
  { label: "Accesos", href: "/admin/accesos" },
];

const IDLE_MS = 20 * 60 * 1000; // 20 minutos
const WARN_MS = 1 * 60 * 1000;  // advertir 1 min antes

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [idleWarning, setIdleWarning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLogin = pathname === "/admin/login";

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warnRef.current) clearTimeout(warnRef.current);
    setIdleWarning(false);
    warnRef.current = setTimeout(() => setIdleWarning(true), IDLE_MS - WARN_MS);
    timeoutRef.current = setTimeout(() => handleLogout(), IDLE_MS);
  }, [handleLogout]);

  useEffect(() => {
    if (isLogin) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) setAdminEmail(session.user.email);
    });

    const events = ["mousemove", "mousedown", "keypress", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warnRef.current) clearTimeout(warnRef.current);
    };
  }, [isLogin, resetTimer]);

  if (isLogin) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      <nav className="bg-white sticky top-0 z-20 shadow-[0_1px_0_0_#f3f4f6]">

        {/* Main bar */}
        <div className="px-4 md:px-6 flex items-stretch justify-between h-16">

          {/* ── Logo + desktop nav ── */}
          <div className="flex items-stretch gap-0">
            {/* Logo */}
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 pr-5 mr-2 border-r border-gray-100 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-falu-red-600 to-yellow-orange-400 flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-black text-[11px] tracking-tight">LZ</span>
              </div>
              <div className="leading-none">
                <p className="text-[13px] font-bold text-gray-900 leading-tight">Academy</p>
                <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase leading-tight">Admin</p>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center h-full">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.href} className="relative h-full flex items-center">
                    <Link
                      href={item.href}
                      className={`px-3 text-sm font-medium transition-colors duration-150 whitespace-nowrap leading-none ${
                        isActive
                          ? "text-falu-red-700 font-semibold"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-falu-red-500 to-yellow-orange-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {/* Session pill — desktop only */}
            {adminEmail && (
              <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-gray-600">{adminEmail.split("@")[0]}</span>
              </div>
            )}

            {/* Logout — desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 px-2.5 py-1.5 rounded-xl cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Salir
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Menú"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            {/* User row */}
            {adminEmail && (
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-50">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-falu-red-500 to-yellow-orange-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">{adminEmail[0].toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{adminEmail.split("@")[0]}</p>
                  <p className="text-[10px] text-gray-400 truncate">{adminEmail}</p>
                </div>
                <span className="ml-auto flex-shrink-0 flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Activo
                </span>
              </div>
            )}

            {/* Nav items */}
            <div className="px-3 py-2 flex flex-col gap-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-falu-red-50 text-falu-red-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1 h-4 rounded-full bg-gradient-to-b from-falu-red-500 to-yellow-orange-400 flex-shrink-0" />
                    )}
                    {!isActive && <span className="w-1 h-4 flex-shrink-0" />}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Logout */}
            <div className="px-3 pb-3 pt-1 border-t border-gray-50 mt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="mt-8 mb-6 border-t border-gray-100 pt-6 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto grid gap-3 sm:grid-cols-2 sm:items-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} LZ English Academy. Todos los derechos reservados.
          </p>
          <div className="flex sm:justify-end">
            <a
              href="https://qali-t.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-white ring-1 ring-inset ring-zinc-200/70 shadow-sm hover:bg-zinc-50 transition"
              aria-label="Powered by QALI-T"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-zinc-900/5 ring-1 ring-inset ring-zinc-200">
                <img src="/logo_solo.png" alt="QALI-T" className="h-4 w-auto object-contain" />
              </span>
              <span className="text-xs font-semibold text-zinc-800">
                Powered by <span className="text-falu-red-800">QALI-T</span>
              </span>
            </a>
          </div>
        </div>
      </footer>

      {/* Idle warning */}
      {idleWarning && (
        <div className="fixed bottom-4 right-4 z-50 bg-white border border-yellow-200 shadow-lg rounded-2xl p-4 flex items-center gap-3 max-w-xs">
          <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700">Sesión por expirar</p>
            <p className="text-xs text-gray-400 mt-0.5">Tu sesión se cerrará por inactividad</p>
          </div>
          <button
            onClick={resetTimer}
            className="flex-shrink-0 text-xs bg-yellow-orange-500 hover:bg-yellow-orange-600 text-white px-3 py-1.5 rounded-lg transition font-medium"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
