"use client";

import { Container } from "@/app/components/Container";
import PremiumButton from "../[mercado]/_components/PremiumButton";
import { useStartDates } from "../hooks/useStartDates";

const CALENDLY_SPEAKING_URL =
    process.env.NEXT_PUBLIC_CALENDLY_SPEAKING_URL || "https://calendly.com/lzacademy590/speaking-session";

export default function PlansSection() {
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
                                Para quienes quieren aprender con estructura clara y a su propio ritmo.
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

                        <a href="#form" className="mt-6 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-50 transition">
                            Seleccionar Essential
                        </a>
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
                        <div className="mt-6">
                            <PremiumButton />
                        </div>
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
                                Para quienes quieren avanzar rápido con clases 1:1 adaptadas a su horario y proceso.
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
                        <a href="#form" className="mt-6 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-falu-red-950 bg-white hover:bg-rose-50 transition">
                            Seleccionar Personalizado
                        </a>
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
                {/*                <p className="relative mt-6 text-center text-xs text-zinc-400">
                    Todos los planes incluyen acceso desde el día de inicio seleccionado. Sin contratos ni compromisos.
                </p>*/}

            </Container>
        </section>
    );
}