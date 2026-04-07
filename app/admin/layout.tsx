"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

const navItems = [
  { label: "Pagos", href: "/admin/dashboard" },
  { label: "Búsqueda", href: "/admin/busqueda" },
  { label: "Formularios de interés", href: "/admin/interes" },
  { label: "Usuarios recurrentes", href: "/admin/recurrentes" },
  { label: "Fechas de inicio", href: "/admin/fechas" },
  { label: "Contenido", href: "/admin/contenido" },
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
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="px-4 md:px-8 flex items-center justify-between h-14">
          {/* Logo + desktop links */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-falu-red-700 mr-4 tracking-tight">
              LZ <span className="text-yellow-orange-500">Admin</span>
            </span>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href
                      ? "bg-falu-red-50 text-falu-red-700 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side: session + logout */}
          <div className="hidden md:flex items-center gap-3">
            {adminEmail && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                {adminEmail.split("@")[0]}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors px-2 py-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Salir
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
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

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
            {adminEmail && (
              <div className="flex items-center gap-2 px-3 py-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-gray-400">{adminEmail}</span>
              </div>
            )}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "bg-falu-red-50 text-falu-red-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-1 px-3 py-2.5 text-sm text-left text-gray-500 hover:bg-gray-50 rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Cerrar sesión
            </button>
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
