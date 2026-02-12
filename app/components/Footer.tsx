import { Container } from "./Container";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfV00z8jTW-0JL_znLT5yhsU9TmfVcvo3hxhgDXWiobA0nodQ/viewform";

export function Footer() {
  return (
    <footer className="mt-14  mb-7 border-t border-zinc-200/70 pt-8">
      <Container>
        <div className="grid gap-3 sm:grid-cols-3 sm:items-center">
          {/* Izquierda */}
          <p className="text-xs text-zinc-500 sm:justify-self-start">
            © {new Date().getFullYear()} LZ Academy. Todos los derechos reservados.
          </p>

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
          <div className="flex justify-start sm:justify-end">
            <a
              href={FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-falu-red-800 hover:text-falu-red-900"
            >
              Inscribirme →
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
