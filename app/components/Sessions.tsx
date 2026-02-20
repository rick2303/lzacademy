import { Container } from "./Container";
import Link from "next/link";
import Pill from "./Pill";

const sesionesMini = [
    { n: "01", title: "Teoría y estructura", desc: "Mapa del día: patrones, claridad y dirección.", accent: "falu" as const },
    { n: "02", title: "Listening", desc: "Exposición real para oído, ritmo y comprensión.", accent: "orange" as const },
    { n: "03", title: "Vocabulario", desc: "Banco de palabras útil para pensar y comunicar.", accent: "falu" as const },
    { n: "04", title: "Lectura", desc: "Gramática en contexto y fluidez mental.", accent: "orange" as const },
    { n: "05", title: "Producción", desc: "Speaking + journaling: donde nace la fluidez.", accent: "falu" as const },
];

export function Sesiones() {
    return (
        < section className="relative py-14 sm:py-18" >
            {/* fondo alternado más rojo */}
            < div className="absolute inset-0 bg-linear-to-b from-white via-falu-red-50/40 to-white" />

            {/* vector lateral */}
            < div className="pointer-events-none absolute -left-30 top-24 h-64 w-64 rounded-full bg-falu-red-300/20 blur-3xl" />

            <Container>
                <div className="relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <Pill tone="falu">Resumen</Pill>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Las 5 sesiones, en simple
                        </h2>
                        <p className="mt-4 text-zinc-600">
                            Cinco bloques diarios que activan el idioma completo.
                        </p>
                    </div>

                    <div className="mt-10 overflow-hidden rounded-3xl ring-1 ring-falu-red-200/60 shadow-sm bg-white/70 backdrop-blur-sm">
                        {/* Header rojo suave */}
                        <div className="bg-falu-red-50/70 px-6 py-5 sm:px-8">
                            <p className="text-sm font-semibold text-falu-red-900">
                                Tu día queda organizado en 5 pasos (sin pensar de más).
                            </p>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                                {sesionesMini.map((s) => (
                                    <div
                                        key={s.n}
                                        className={[
                                            "rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm",
                                            "transition hover:-translate-y-0.5 hover:shadow-md",
                                        ].join(" ")}
                                    >
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
                                            <Pill tone={s.accent === "orange" ? "orange" : "falu"}>Sesión</Pill>
                                        </div>

                                        <p className="mt-4 text-sm font-semibold text-zinc-900">{s.title}</p>
                                        <p className="mt-2 text-sm text-zinc-600">{s.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center">
                                <Link
                                    href="/sesiones"
                                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm"
                                >
                                    Ver detalle de las sesiones →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section >
    );
}
export default Sesiones; 