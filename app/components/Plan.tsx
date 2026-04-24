"use client";

import { Container } from "@/app/components/Container";
import { useStartDates } from "../hooks/useStartDates";

const CALENDLY_SPEAKING_URL =
    process.env.NEXT_PUBLIC_CALENDLY_SPEAKING_URL || "https://calendly.com/lzacademy590/speaking-session";

interface PlansSectionProps {
    onSelectPlan?: (plan: "Essential" | "Premium" | "Personalizado") => void;
}

export default function PlansSection({ onSelectPlan }: PlansSectionProps) {
    const { dates } = useStartDates();
    return (
        <section id="planes" className="relative py-16 sm:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-zinc-50" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.8)_1px,transparent_0)] bg-size-[20px_20px]" />
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-falu-red-200/30 blur-3xl" />

            <Container>
                <div className="relative text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
                        Elige el plan que se adapta a tu ritmo y objetivo
                    </h2>
                    <p className="mt-3 text-sm text-zinc-500">
                        {dates.length > 0 ? (
                            <>
                                Próximo inicio:{" "}
                                {dates.slice(0, 3).map((d, i) => (
                                    <span key={d.value}>
                                        <span className="font-semibold text-zinc-700">{d.label}</span>
                                        {i < Math.min(dates.length, 3) - 1 && " · "}
                                    </span>
                                ))}
                            </>
                        ) : (
                            <span className="font-semibold text-zinc-700">Próximamente</span>
                        )}
                    </p>
                </div>

                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden ring-1 ring-zinc-200 shadow-lg">

                    {/* ── 1. Essential ── */}
                    <div className="relative flex flex-col p-7 border-r border-[#c9a227]/30" style={{ background: "linear-gradient(160deg, #fdf6dc 0%, #f5e4a0 60%, #eedB82 100%)" }}>
                        <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c9a227]/20 px-2.5 py-1 text-xs font-semibold text-[#7a5c10] ring-1 ring-inset ring-[#c9a227]/40">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227] animate-pulse" />
                                Nivel base
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-[#8a6510] mb-1">
                                Essential
                            </p>
                            <h3 className="text-xl font-extrabold text-zinc-900">
                                Curso Essential
                            </h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-zinc-900">$10</span>
                                <span className="text-sm text-[#8a6510]">/ mes</span>
                            </div>
                            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
                                Aprende con estructura clara — material completo, comunidad y clases grupales en vivo los viernes.
                            </p>
                        </div>

                        <div className="border-t border-[#c9a227]/40 pt-5 mt-6 flex-1">
                            <p className="text-xs font-semibold text-[#8a6510] mb-3">Incluye:</p>
                            <ul className="space-y-3">
                                {[
                                    "Acceso completo a la plataforma",
                                    "Comunidad en WhatsApp",
                                    "Material organizado por sesiones y nivel",
                                    "Método paso a paso",
                                    "Reuniones de práctica los viernes",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-800">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                                            <path d="M4.5 8l2.5 2.5L11.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-[#7a5c10] italic">
                                Accede hoy a la plataforma. Las clases en vivo inician en la fecha seleccionada en el formulario.
                            </p>
                        </div>

                        <button
                            onClick={() => onSelectPlan?.("Essential")}
                            className="mt-6 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-50 transition"
                        >
                            Seleccionar Essential
                        </button>
                    </div>

                    {/* ── 2. Premium ── */}
                    <div className="relative flex flex-col p-7 bg-falu-red-800 border-r border-white/10">
                        <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/25">
                                <span className="h-1.5 w-1.5 rounded-full bg-yellow-orange-300 animate-pulse" />
                                Más popular
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Premium</p>
                            <h3 className="text-xl font-extrabold text-white">Curso Premium</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-white">$50</span>
                                <span className="text-sm text-white/50">/ mes</span>
                            </div>
                            <p className="mt-3 text-sm text-white/70 leading-relaxed">
                                Para quienes quieren clases en vivo y avanzar más rápido con acompañamiento diario.
                            </p>
                        </div>
                        <div className="border-t border-white/15 pt-5 mt-6 flex-1">
                            <p className="text-xs font-semibold text-white/50 mb-3">Todo lo de Essential, más:</p>
                            <ul className="space-y-3">
                                {[
                                    "1 hora de clase diaria (lunes a jueves)",
                                    "Repasos los viernes para resolver dudas",
                                    "Explicación clara de teoría",
                                    "Práctica guiada en cada clase",
                                    "Seguimiento y motivación constante",
                                    "Guía para completar tus sesiones diarias",
                                    "Estructura para lograr fluidez en menos tiempo",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-400" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
                                            <path d="M4.5 8l2.5 2.5L11.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-white/40 italic">Horario fijo lunes a jueves.</p>
                        </div>
                        <button
                            onClick={() => onSelectPlan?.("Premium")}
                            className="mt-6 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-falu-red-900 bg-white hover:bg-zinc-50 transition"
                        >
                            Seleccionar Premium
                        </button>
                    </div>

                    {/* ── 3. Personalizado ── */}
                    <div className="relative flex flex-col p-7 bg-falu-red-950 border-r border-white/5">
                        <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/25">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                                Recomendado
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Personalizado</p>
                            <h3 className="text-xl font-extrabold text-white">Método 590 · 1:1</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-white">$100</span>
                                <span className="text-sm text-white/40">/ mes</span>
                            </div>
                            <p className="mt-3 text-sm text-white/60 leading-relaxed">
                                Clases <span className="font-semibold text-white/80">1:1 privadas</span> con tu propio profesor — horario flexible, plan adaptado a ti desde el día 1.
                            </p>
                        </div>
                        <div className="border-t border-white/10 pt-5 mt-6 flex-1">
                            <p className="text-xs font-semibold text-white/40 mb-3">Todo lo anterior, más:</p>
                            <ul className="space-y-3">
                                {[
                                    "Sesiones privadas 1:1 adaptadas a ti",
                                    "Acceso completo al Método 590",
                                    "Horario 100% flexible",
                                    "Plan de trabajo personalizado desde el día 1",
                                    "Seguimiento y motivación constante",
                                    "Corrección en tiempo real",
                                    "Avanza exactamente a tu ritmo",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-400" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
                                            <path d="M4.5 8l2.5 2.5L11.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-white/30 italic">Agendas tu primera sesión y definimos juntos el plan.</p>
                        </div>
                        <button
                            onClick={() => onSelectPlan?.("Personalizado")}
                            className="mt-6 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-falu-red-950 bg-white hover:bg-rose-50 transition"
                        >
                            Seleccionar Personalizado
                        </button>
                    </div>

                    {/* ── 4. Speaking ── */}
                    <div className="flex flex-col p-7 bg-yellow-orange-50">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">Speaking</p>
                            <h3 className="text-xl font-extrabold text-zinc-900">Sesión de Speaking</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-zinc-900">$15</span>
                                <span className="text-sm text-zinc-400">/ sesión</span>
                            </div>
                            <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                                30 min de conversación real, pronunciación y corrección en tiempo real.
                            </p>
                        </div>
                        <div className="border-t border-zinc-100 pt-5 mt-6 flex-1">
                            <p className="text-xs font-semibold text-zinc-500 mb-3">Incluye:</p>
                            <ul className="space-y-3">
                                {[
                                    "Conversación según tu nivel de inglés",
                                    "Corrección gramatical en tiempo real",
                                    "Mejora de pronunciación",
                                    "Herramientas para mayor fluidez",
                                    "30 min (puede extenderse sin costo extra)",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-600">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
                                            <path d="M4.5 8l2.5 2.5L11.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-zinc-400 italic">* Miembros de la Academia reciben esta sesión con descuento.</p>
                        </div>
                        <a href={CALENDLY_SPEAKING_URL} target="_blank" className="mt-6 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-50 transition">
                            Reservar sesión
                        </a>
                    </div>

                </div>
                {/* WhatsApp CTA */}
                <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl bg-white/70 ring-1 ring-zinc-200 px-6 py-5">
                    <p className="text-sm text-zinc-600 text-center sm:text-left">
                        ¿Tienes dudas antes de inscribirte? Únete a la comunidad y pregunta.
                    </p>
                    <a
                        href="https://chat.whatsapp.com/HhAvLoPoLwf1JsX0aWtnX1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1ebe57] transition shadow-sm"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Unirme a la comunidad
                    </a>
                </div>

            </Container>
        </section>
    );
}