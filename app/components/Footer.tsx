import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-14  mb-7 border-t border-zinc-200/70 pt-8">
      <Container>
        <div className="grid gap-3 sm:grid-cols-3 sm:items-center">
          {/* Izquierda */}
          <div className="sm:justify-self-start">
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} LZ English Academy. Todos los derechos reservados.
            </p>
            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
              <a href="/terminos" className="hover:text-zinc-700">
                Términos
              </a>
              <span aria-hidden="true" className="text-zinc-300">
                ·
              </span>
              <a href="/reembolsos" className="hover:text-zinc-700">
                Reembolsos
              </a>
              <span aria-hidden="true" className="text-zinc-300">
                ·
              </span>
              <a href="/privacidad" className="hover:text-zinc-700">
                Privacidad
              </a>
              <span aria-hidden="true" className="text-zinc-300">
                ·
              </span>
              <a href="/mi-suscripcion" className="hover:text-zinc-700">
                Gestionar suscripción
              </a>
            </div>
          </div>

          {/* Centro */}
          <div className="flex justify-center">
            <a
              href="https://qali-t.com"
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "inline-flex items-center gap-2 rounded-2xl px-3 py-2",
                "bg-white ring-1 ring-inset ring-zinc-200/70 shadow-sm",
                "hover:bg-zinc-50 transition",
              ].join(" ")}
              aria-label="Powered by QALI-T"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-zinc-900/5 ring-1 ring-inset ring-zinc-200">
                <img
                  src="/logo_solo.png"
                  alt="QALI-T"
                  className="h-4 w-auto object-contain"
                />
              </span>
              <span className="text-xs font-semibold text-zinc-800">
                Powered by <span className="text-falu-red-800">QALI-T</span>
              </span>
            </a>
          </div>

          {/* Derecha */}
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <a
              href="/paso-uno"
              className="text-xs font-semibold text-falu-red-800 hover:text-falu-red-900"
            >
              Inscribirme →
            </a>
            <a
              href="https://app.lainz590.com/login"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800"
            >
              Acceder a la plataforma →
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
