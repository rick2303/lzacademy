"use client";

import React, { useState } from "react";

const CALENDLY_INFO_URL =
    process.env.NEXT_PUBLIC_CALENDLY_INFO_URL || "https://calendly.com/lzacademy590/info-session-introduction";

// ─── SVG Icons ────────────────────────────────────────────────────────────
const IconCalendar = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M1.5 6h13" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="4" y="8.5" width="2" height="2" rx="0.4" fill="currentColor" />
        <rect x="7" y="8.5" width="2" height="2" rx="0.4" fill="currentColor" />
        <rect x="4" y="11" width="2" height="2" rx="0.4" fill="currentColor" />
    </svg>
);

const IconClock = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconMonitor = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5.5 13.5h5M8 11.5v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const IconGlobe = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 1.75C8 1.75 6 4.5 6 8s2 6.25 2 6.25M8 1.75C8 1.75 10 4.5 10 8s-2 6.25-2 6.25M1.75 8h12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="#9c181d" />
        <path d="M5 8.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconArrow = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 7h8M7.5 4l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconPerson = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="4.5" r="2.25" stroke="#9c181d" strokeWidth="1.25" />
        <path d="M2.5 12c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="#9c181d" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
);

// ─── TopBar (barra superior dismissible) ─────────────────────────────────
export function TopBar() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm relative"
            style={{ backgroundColor: "#6b0f1a" }}
        >
            {/* Punto pulsante */}
            <span
                className="shrink-0 w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#f5a623" }}
            />

            {/* Texto */}
            <p className="text-white/90 text-center leading-snug">
                <span className="font-bold" style={{ color: "#f5a623" }}>
                    Info Sessions gratuitas
                </span>{" "}
                — Resuelva sus dudas sobre el Método 590 antes de inscribirse.{" "}
                <span className="text-white/50 text-xs">Cupos limitados.</span>
            </p>

            {/* Botón Reservar */}
            <a
                href={CALENDLY_INFO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#f5a623", color: "#3a1a00" }}
            >
                Reservar →
            </a>

            {/* Botón cerrar */}
            <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Cerrar"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition text-base leading-none"
            >
                ×
            </button>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────
export function InfoSessionSection() {
    const bullets = [
        "Puede hacer las preguntas que quiera, sin compromiso",
        "Explicamos cómo funciona el Método 590 paso a paso",
        "Le ayudamos a evaluar si es la opción adecuada",
        "Sesión online de aproximadamente 45 minutos, en español",
    ];

    const details = [
        { Icon: IconCalendar, label: "Fecha", value: "Según disponibilidad" },
        { Icon: IconClock, label: "Duración", value: "~45 minutos" },
        { Icon: IconMonitor, label: "Formato", value: "Online (Zoom)" },
        { Icon: IconGlobe, label: "Idioma", value: "100% en español" },
    ];

    return (
        <section
            className="relative w-full py-20 px-4 overflow-hidden"
            style={{ background: "#fafafa" }}
        >
            <div aria-hidden className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(156,24,29,0.1)" }} />

            <div className="relative max-w-7xl mx-auto px-4 lg:px-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

                    {/* ── Columna izquierda ── */}
                    <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#9c181d" }}>
                            Info Session — Gratuita
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-5" style={{ color: "#111" }}>
                            ¿Tiene dudas sobre
                            <br />
                            <span style={{ color: "#9c181d" }}>el Método 590?</span>
                        </h2>
                        <p className="text-base leading-relaxed mb-8" style={{ color: "#555", maxWidth: "460px" }}>
                            Empezar algo nuevo puede generar incertidumbre. Por eso abrimos
                            sesiones informativas gratuitas para explicar el programa y
                            ayudar a cada persona a decidir con claridad.
                        </p>
                        <ul className="space-y-3 mb-10">
                            {bullets.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#333" }}>
                                    <span className="mt-0.5 shrink-0"><IconCheck /></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <a
                            href={CALENDLY_INFO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
                            style={{ background: "#9c181d" }}
                        >
                            Reservar lugar gratuito
                            <IconArrow />
                        </a>
                        <p className="flex items-center gap-2 mt-3 text-xs" style={{ color: "#999" }}>
                            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: "#f47a0c" }} />
                            Cupos limitados por sesión
                        </p>
                    </div>

                    {/* ── Columna derecha ── */}
                    <div
                        className="w-full lg:w-80 shrink-0 rounded-2xl overflow-hidden"
                        style={{ border: "1px solid rgba(156,24,29,0.12)", background: "#fff" }}
                    >
                        <div className="px-7 pt-7 pb-5">
                            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9c181d" }}>
                                Info Session
                            </p>
                            <p className="text-2xl font-black" style={{ color: "#111" }}>Gratuita</p>
                            <p className="text-xs mt-1" style={{ color: "#aaa" }}>sin costo · sin compromiso</p>
                        </div>
                        <div style={{ height: "1px", background: "rgba(156,24,29,0.08)", margin: "0 28px" }} />
                        <div className="px-7 py-5 space-y-5">
                            {details.map(({ Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <span
                                        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                                        style={{ background: "rgba(156,24,29,0.07)", color: "#9c181d" }}
                                    >
                                        <Icon />
                                    </span>
                                    <div>
                                        <p className="text-xs" style={{ color: "#aaa" }}>{label}</p>
                                        <p className="text-sm font-semibold" style={{ color: "#111" }}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <div aria-hidden className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(156,24,29,0.1)" }} />
        </section>
    );
}

// ─── Componente mini (debajo de precios) ──────────────────────────────────
export function InfoSessionMini() {
    return (
        <div
            className="max-w-2xl mx-auto my-8 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border"
            style={{ background: "#fff", borderColor: "rgba(156,24,29,0.15)" }}
        >
            <div className="flex items-start gap-3">
                <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: "rgba(156,24,29,0.08)" }}
                >
                    <IconPerson />
                </div>
                <div>
                    <p className="text-sm font-semibold" style={{ color: "#111" }}>
                        ¿No está seguro qué plan elegir?
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#777" }}>
                        Agende una Info Session gratuita y resuelva sus dudas antes de inscribirse.
                    </p>
                </div>
            </div>
            <a
                href={CALENDLY_INFO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: "#9c181d" }}
            >
                Info Session gratuita
                <IconArrow />
            </a>
        </div>
    );
}