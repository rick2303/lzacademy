import Link from "next/link";
import { Container } from "../components/Container";

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

const sesiones = [
  {
    n: "01",
    title: "Teoría y estructura (el mapa)",
    accent: "falu" as const,
    intro:
      "Aquí construís la base del día: patrones, estructura y claridad.",
    body: [
      "A diferencia de un niño, el adulto necesita un mapa mental para entender cómo funciona el idioma.",
      "Esta sesión te da dirección: lo que estás aprendiendo, por qué se usa así y cómo aplicarlo.",
      "No es teoría por teoría. Es estructura para acelerar el proceso y preparar el cerebro para todo lo que viene.",
    ],
  },
  {
    n: "02",
    title: "Listening (exposición real)",
    accent: "orange" as const,
    intro:
      "Inmersión auditiva con apoyo visual para entrenar comprensión real.",
    body: [
      "El cerebro aprende por exposición constante.",
      "Se trabaja viendo una película o contenido en inglés con subtítulos en inglés.",
      "Esto entrena oído (sonidos, ritmo, pronunciación), comprensión real y reconocimiento de palabras en contexto.",
      "Aquí el idioma comienza a sentirse natural.",
    ],
    bullets: [
      "Oído (sonidos, ritmo, pronunciación)",
      "Comprensión real",
      "Reconocimiento de palabras dentro de contexto",
    ],
  },
  {
    n: "03",
    title: "Memorización de vocabulario (construcción de base)",
    accent: "falu" as const,
    intro:
      "Construís el material del idioma: palabras, frases y expresiones.",
    body: [
      "No es memorizar por memorizar. Es construir vocabulario como herramienta diaria.",
      "Se trabaja de forma organizada y repetida para que pase de corto plazo a largo plazo.",
      "Aquí se construye el “banco de palabras” que después se usa al hablar y escribir.",
    ],
  },
  {
    n: "04",
    title: "Lectura (estructura interna del idioma)",
    accent: "orange" as const,
    intro:
      "Leer entrena al cerebro a procesar inglés con más profundidad.",
    body: [
      "Se lee un libro (adaptado al nivel) para desarrollar comprensión sostenida e intuición del idioma.",
      "Aprendés gramática en contexto, orden natural de frases, conectores y estilo real.",
      "Leer no solo enseña inglés: enseña cómo piensa el inglés.",
    ],
    bullets: [
      "Comprensión sostenida",
      "Intuición del idioma",
      "Vocabulario contextual",
      "Fluidez mental al procesar estructuras",
    ],
  },
  {
    n: "05",
    title: "Producción: práctica hablada y escrita (donde nace la fluidez)",
    accent: "falu" as const,
    intro: "El idioma se vuelve tuyo cuando lo producís.",
    body: [
      "Esta sesión transforma el conocimiento en habilidad.",
      "Speaking Challenge: hablar (aunque sea solo) y enviar audio / responder un reto.",
      "Journaling: escribir para entrenar pensamiento y expresión real.",
      "Aquí se consolidan las cuatro sesiones anteriores. Todo lo que escuchás, memorizás y leés… debe salir de vos.",
    ],
    bullets: ["Speaking Challenge", "Journaling", "Consolidación diaria"],
  },
];

export default function SesionesPage() {
  return (
    <main className="bg-white text-zinc-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-falu-red-50 via-white to-yellow-orange-50" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-falu-red-300/22 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-yellow-orange-300/22 blur-3xl" />

        <Container>
          <div className="relative py-12 sm:py-16">
            <Pill tone="neutral">Estructura diaria</Pill>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Las 5 sesiones del Método 590
            </h1>
            <p className="mt-5 max-w-3xl text-base text-zinc-600 sm:text-lg">
              Cada sesión activa un canal distinto del cerebro para que el idioma
              se convierta en experiencia y rutina.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-yellow-orange-500 hover:bg-yellow-orange-600 active:bg-yellow-orange-700 transition shadow-sm"
              >
                Comenzar proceso
              </a>
              <Link
                href="/metodo"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
              >
                Volver a Método
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-6">
            {sesiones.map((s) => {
              const isOrange = s.accent === "orange";
              return (
                <Card key={s.n} className="relative overflow-hidden">
                  <div
                    className={[
                      "pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl",
                      isOrange ? "bg-yellow-orange-300/12" : "bg-falu-red-300/12",
                    ].join(" ")}
                  />

                  <div className="relative">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <span
                          className={[
                            "inline-flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-extrabold ring-1 ring-inset",
                            isOrange
                              ? "bg-yellow-orange-100 text-yellow-orange-900 ring-yellow-orange-200"
                              : "bg-falu-red-100 text-falu-red-900 ring-falu-red-200",
                          ].join(" ")}
                        >
                          {s.n}
                        </span>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Pill tone={isOrange ? "orange" : "falu"}>Sesión</Pill>
                            <h2 className="text-xl font-extrabold tracking-tight">
                              {s.title}
                            </h2>
                          </div>
                          <p className="mt-2 text-sm text-zinc-600">{s.intro}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
                      <div className="lg:col-span-8 space-y-3 text-zinc-700">
                        {s.body.map((p, idx) => (
                          <p key={idx} className="text-sm leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>

                      <div className="lg:col-span-4">
                        <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-inset ring-zinc-200/70">
                          <p className="text-xs font-semibold text-zinc-700">
                            En esta sesión entrenás
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {(s.bullets ?? ["Estructura", "Práctica", "Progreso"]).map(
                              (b) => (
                                <span
                                  key={b}
                                  className={[
                                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                                    isOrange
                                      ? "bg-yellow-orange-50 text-yellow-orange-900 ring-yellow-orange-200"
                                      : "bg-falu-red-50 text-falu-red-900 ring-falu-red-200",
                                  ].join(" ")}
                                >
                                  {b}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-10">
            <Card className="bg-zinc-50">
              <p className="text-sm font-semibold text-falu-red-900">
                Cuando repetís estas cinco sesiones diariamente, el inglés deja de ser
                una materia y se convierte en una rutina cerebral.
              </p>
              <p className="mt-2 text-sm text-zinc-700">
                Esto no es estudiar inglés. Es vivirlo todos los días con intención.
              </p>
            </Card>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-yellow-orange-500 hover:bg-yellow-orange-600 active:bg-yellow-orange-700 transition shadow-sm"
            >
              Ir al formulario
            </a>
            <Link
              href="/ciencia"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
            >
              Ver la ciencia →
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
