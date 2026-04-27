"use client";

import Image from "next/image";
import Link from "next/link";
import { TestimonialsSection } from "../components/Testimonials";

export default function InicioPage() {
    return (
        <>
            <section
                className="relative overflow-hidden"
                style={{ backgroundColor: "#fadadd" }}
            >

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

                        {/* ── Columna izquierda */}
                        <div className="z-10 flex flex-col items-center order-1 lg:order-1">

                            <div className="relative mt-1 w-full h-[250px] sm:h-[300px] lg:h-[320px]">
                                <Image
                                    src="/textoinicio.svg"
                                    alt="M590 siguiente nivel en 90 dias"
                                    fill
                                    className="object-contain object-center "
                                    priority
                                />
                            </div>

                            {/* CTA  */}
                            <div className="hidden lg:flex mt-10 flex-col items-center gap-3 w-full">
                                <Link
                                    href="/pasouno"
                                    className="inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-extrabold text-white shadow-lg transition hover:opacity-90 active:scale-95 w-fit mx-auto"
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
                                    className="inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-extrabold transition hover:opacity-80 active:scale-95 w-fit mx-auto"
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

                        {/* ── Columna derecha: ilustración ── */}
                        <div className="relative flex items-center justify-center lg:h-[520px] order-2 lg:order-2">
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


                        <div className="flex lg:hidden flex-col items-center gap-3 order-3">
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
                </div>
            </section>
            <TestimonialsSection />
        </>
    );
}