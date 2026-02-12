import Link from "next/link";
import { Container } from "./components/Container";
import { TestimonialsSection } from "./components/Testimonials";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfV00z8jTW-0JL_znLT5yhsU9TmfVcvo3hxhgDXWiobA0nodQ/viewform";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5",
        "transition hover:shadow-md hover:-translate-y-0.5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Pill({
  children,
  tone = "falu",
}: {
  children: React.ReactNode;
  tone?: "falu" | "orange" | "neutral";
}) {
  const styles =
    tone === "orange"
      ? "bg-yellow-orange-50 text-yellow-orange-900 ring-yellow-orange-200"
      : tone === "falu"
        ? "bg-falu-red-50 text-falu-red-900 ring-falu-red-200"
        : "bg-zinc-50 text-zinc-700 ring-zinc-200";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        styles,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

const sesionesMini = [
  {
    n: "01",
    title: "Teoría y estructura",
    desc: "Mapa del día: patrones, claridad y dirección.",
    accent: "falu" as const,
  },
  {
    n: "02",
    title: "Listening",
    desc: "Exposición real para oído, ritmo y comprensión.",
    accent: "orange" as const,
  },
  {
    n: "03",
    title: "Vocabulario",
    desc: "Banco de palabras útil para pensar y comunicar.",
    accent: "falu" as const,
  },
  {
    n: "04",
    title: "Lectura",
    desc: "Gramática en contexto y fluidez mental.",
    accent: "orange" as const,
  },
  {
    n: "05",
    title: "Producción",
    desc: "Speaking + journaling: donde nace la fluidez.",
    accent: "falu" as const,
  },
];

export default function Page() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-falu-red-50 via-white to-yellow-orange-50" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-falu-red-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-yellow-orange-300/25 blur-3xl" />

        <Container>
          <div className="relative py-16 sm:py-20">
            <Pill tone="falu">Aprende inglés en 90 días</Pill>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
              Con método. Con ciencia.{" "}
              <span className="text-falu-red-800">Con propósito.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-zinc-600 sm:text-lg">
              El Método 590 convierte el inglés en una rutina diaria estructurada
              para construir fluidez real.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-yellow-orange-500 hover:bg-yellow-orange-600 active:bg-yellow-orange-700 transition shadow-sm"
              >
                Comenzar mi proceso
              </a>

              <Link
                href="/metodo"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
              >
                Ver el método
              </Link>
            </div>

            {/* 3 highlights */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="p-5">
                <p className="text-sm font-semibold text-falu-red-900">
                  Estructura diaria
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Rutina clara para avanzar sin improvisar.
                </p>
              </Card>

              <Card className="p-5">
                <p className="text-sm font-semibold text-falu-red-900">
                  Ciencia cognitiva
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Ritmo + repetición + consistencia.
                </p>
              </Card>

              <Card className="p-5">
                <p className="text-sm font-semibold text-falu-red-900">
                  Producción real
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Speaking + journaling con feedback.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* 5 SESIONES (RESUMEN EN CARDS) */}
      <section className="py-14 sm:py-18 bg-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Pill tone="neutral">Resumen</Pill>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Las 5 sesiones, en simple
            </h2>
            <p className="mt-4 text-zinc-600">
              Cinco bloques diarios que activan el idioma completo.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {sesionesMini.map((s) => (
              <Card key={s.n} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={[
                      "inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-extrabold ring-1 ring-inset",
                      s.accent === "orange"
                        ? "bg-yellow-orange-100 text-yellow-orange-900 ring-yellow-orange-200"
                        : "bg-falu-red-100 text-falu-red-900 ring-falu-red-200",
                    ].join(" ")}
                  >
                    {s.n}
                  </span>

                  <Pill tone={s.accent === "orange" ? "orange" : "falu"}>
                    Sesión
                  </Pill>
                </div>

                <p className="mt-4 text-sm font-semibold text-zinc-900">
                  {s.title}
                </p>
                <p className="mt-2 text-sm text-zinc-600">{s.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/sesiones"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
            >
              Ver detalle de las sesiones →
            </Link>
          </div>
        </Container>
      </section>

      {/* ✅ TESTIMONIOS (ahora como componente) */}
      <TestimonialsSection />

      {/* MENTORA (preview) */}
      <section className="py-14 sm:py-18 bg-yellow-orange-50/35">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Pill tone="falu">La mentora</Pill>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                El método nació de una necesidad real
              </h2>
              <p className="mt-4 text-zinc-600">
                La mentora necesitaba aprender inglés en 3 meses para una
                entrevista completa en inglés. Así nació una rutina estructurada
                en 5 sesiones diarias.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/mentora"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                >
                  Conocer su historia
                </Link>

                <Link
                  href="/metodo"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:bg-white transition"
                >
                  Ver el método completo
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="relative overflow-hidden hover:ring-falu-red-200">
                <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-falu-red-300/18 blur-3xl" />
                <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-yellow-orange-300/18 blur-3xl" />

                <p className="text-sm font-semibold text-zinc-900">
                  ¿Qué vas a vivir en el método?
                </p>

                <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-yellow-orange-500" />
                    5 sesiones diarias con propósito
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-yellow-orange-500" />
                    Speaking real + journaling con feedback
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-yellow-orange-500" />
                    Progreso visible semana a semana
                  </li>
                </ul>

                <div className="mt-6">
                  <Link
                    href="/sesiones"
                    className="text-sm font-semibold text-falu-red-800 hover:text-falu-red-900"
                  >
                    Ver detalle de sesiones →
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <Card className="relative overflow-hidden">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-falu-red-300/15 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-yellow-orange-300/15 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  ¿Listo para comenzar tu proceso?
                </h2>
                <p className="mt-3 text-zinc-600">
                  Llena el formulario y te orientamos para iniciar con el Método 590.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row lg:justify-end">
                <a
                  href={FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-yellow-orange-500 hover:bg-yellow-orange-600 active:bg-yellow-orange-700 transition shadow-sm"
                >
                  Ir al formulario
                </a>
                <Link
                  href="/metodo"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}
