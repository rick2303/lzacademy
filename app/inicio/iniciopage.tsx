"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TestimonialsSection } from "../components/Testimonials";


export default function InicioPage() {
    return (

        <>
            <section
                className="relative overflow-hidden"
                style={{ backgroundColor: "#fadadd" }}
            >
                {/* Textura de puntos sutil */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #9c181d 1px, transparent 0)",
                        backgroundSize: "18px 18px",
                    }}
                />
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative grid min-h-[520px] grid-cols-1 items-center gap-8 py-12 lg:grid-cols-2 lg:py-0">

                        {/* ── Columna izquierda: texto ── */}
                        <div className="z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
                            {/* "Tu" */}
                            <p
                                className="text-6xl sm:text-7xl leading-none"
                                style={{
                                    fontFamily: "var(--font-playfair), Georgia, serif",
                                    fontStyle: "italic",
                                    fontWeight: 400,
                                    color: "#E33751",
                                }}
                            >
                                Tu
                            </p>

                            {/* "INGLÉS  Al" */}
                            <div className="flex items-baseline gap-4 leading-none">
                                <span
                                    className="text-8xl sm:text-9xl font-extrabold tracking-tight leading-none"
                                    style={{
                                        fontFamily: "var(--font-barlow), 'Arial Black', sans-serif",
                                        fontWeight: 800,
                                        letterSpacing: "-0.01em",
                                        color: "#E33751",
                                    }}
                                >
                                    INGLÉS
                                </span>
                                <span
                                    className="text-5xl sm:text-6xl leading-none"
                                    style={{
                                        fontFamily: "var(--font-playfair), Georgia, serif",
                                        fontStyle: "italic",
                                        fontWeight: 400,
                                        color: "#E33751",
                                    }}
                                >
                                    Al
                                </span>
                            </div>
                            {/* "M590" vertical + "siguiente nivel / en 90 dias" */}
                            <div className="flex items-center  mt-1">
                                <span
                                    className="font-extrabold text-zinc-600 select-none shrink-0"
                                    style={{
                                        writingMode: "vertical-rl",
                                        textOrientation: "mixed",
                                        transform: "rotate(180deg)",
                                        letterSpacing: "0.18em",
                                        fontFamily: "var(--font-barlow), 'Arial Black', sans-serif",
                                        fontWeight: 800,
                                        fontSize: "2.75rem",
                                    }}
                                >
                                    M590
                                </span>
                                <div className="leading-tight">
                                    <p
                                        className="text-4xl sm:text-5xl font-extrabold"
                                        style={{
                                            fontFamily: "var(--font-barlow), 'Arial Black', sans-serif",
                                            fontWeight: 700,
                                            color: "#945353",
                                        }}
                                    >
                                        siguiente nivel
                                    </p>
                                    <p
                                        className="text-6xl sm:text-7x font-extrabold text-zinc-700"
                                        style={{
                                            fontFamily: "var(--font-barlow), 'Arial Black', sans-serif",
                                            fontWeight: 700,
                                        }}
                                    >
                                        en{" "}
                                        <span style={{ color: "#bd181e", fontSize: "1.4em", lineHeight: 1 }}>90</span>{" "}
                                        dias
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-10 flex flex-col items-center gap-3 lg:items-start">
                                <Link
                                    href="/pasouno"
                                    className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-extrabold text-white shadow-lg transition hover:opacity-90 active:scale-95"
                                    style={{
                                        backgroundColor: "#bd181e",
                                        fontFamily: "var(--font-barlow), 'Arial Black', sans-serif",
                                        fontWeight: 700,
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    Empezar Proceso
                                    <span className="text-xl leading-none">›</span>
                                </Link>
                                <Link
                                    href="/pasotres"
                                    className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-extrabold transition hover:opacity-80 active:scale-95"
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "2px solid #bd181e",
                                        color: "#bd181e",
                                        fontFamily: "var(--font-barlow), 'Arial Black', sans-serif",
                                        fontWeight: 700,
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    Ya soy estudiante
                                    <span className="text-xl leading-none">›</span>
                                </Link>
                            </div>
                        </div>

                        {/* ── Columna derecha: ilustración */}
                        <div className="relative flex items-center justify-center lg:h-[520px]">

                            {/* human.svg — persona + teléfono + bombilla todo en uno */}
                            <div className="relative w-full h-full min-h-[250px] select-none">
                                <Image
                                    src="/human.svg"
                                    alt="Persona estudiando inglés con laptop"
                                    fill
                                    className="object-contain object-center"
                                    priority
                                />
                            </div>


                        </div>
                    </div>
                </div>
            </section>
            <TestimonialsSection />
        </>
    );
}