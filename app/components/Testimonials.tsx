"use client";

import { Container } from "./Container";
import ReactCountryFlag from "react-country-flag";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type Testimonial = {
    name: string;
    country: string;
    countryCode: string;
    text: string;
};

const testimonials: Testimonial[] = [
    {
        name: "Mónica Alvarado de Paz ",
        country: "Guatemala",
        countryCode: "GT",
        text: "El curso 590 me ayudó a aprender inglés después de años de intentar entender el idioma. Mejoró mi confianza y en un mes, comencé a ver los cambios.",
    },
    {
        name: "Sharick González",
        country: "Ecuador",
        countryCode: "EC",
        text: "Este curso me ayudó a mejorar y reforzar mucho en mi nivel A2 y tambien hizo que en mi escuela entendiera fácilmente las clases de inglés.",
    },
    {
        name: "Anónimo",
        country: "Estados Unidos",
        countryCode: "US",
        text: "El método 590 es completo, refuerza conocimiento, lectura, escritura y speaking, el material proporcionado es totalmente fácil de usar, me ha ayudado mucho.",
    },
    {
        name: "Valeria Aguilar",
        country: "México",
        countryCode: "MX",
        text: "Es un método en donde te acostumbras a la semana y se vuelve un hábito, en un mes tuve más avance que con otros cursos particulares, lo recomiendo mucho.",
    },
    {
        name: "Brendalix Ortega",
        country: "Colombia",
        countryCode: "CO",
        text: "Aprendí a defenderme en inglés, puedo comunicar, realizar preguntas a otras personas y entender lo que me dicen mis compañeros. Super recomiendo este método y curso.",
    },
    {
        name: "Mhia Olvera",
        country: "México",
        countryCode: "MX",
        text: "Me ayudó a entender más la gramática, es muy fácil de aprender. El ser algo que integras en tu día a día, ayuda demasiado a adaptarte y a entenderlo mejor, vale totalmente la pena.",
    },
    {
        name: "Anónimo",
        country: "El Salvador",
        countryCode: "SV",
        text: "El método 590 me ha ayudado mucho a ser más fluida y mejorar mi confianza con el inglés. Tener una rutina de estudio cada día, hace que sea más fácil para mí seguirla.",
    },
];

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
                "h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5",
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

export function TestimonialsSection() {
    return (
        <section className="py-14 sm:py-18 bg-white">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <Pill tone="orange">Testimonios</Pill>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Resultados que se sienten
                    </h2>
                    <p className="mt-4 text-zinc-600">
                        Confianza, estructura y fluidez real con práctica diaria.
                    </p>
                </div>

                {/* Carousel */}
                <div className="mt-10">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        loop
                        centeredSlides
                        grabCursor
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        // ✅ el default (mobile-first) es 1 slide
                        slidesPerView={1}
                        spaceBetween={14}
                        // ✅ para que en mobile se vea full-width y se sienta “pro”
                        style={{ paddingBottom: "32px" }}
                        breakpoints={{
                            640: { slidesPerView: 1.15, spaceBetween: 16 }, // “peek”
                            768: { slidesPerView: 2, spaceBetween: 18, centeredSlides: false },
                            1024: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
                        }}
                    >
                        {testimonials.map((t) => (
                            <SwiperSlide
                                key={`${t.name}-${t.country}-${t.text.slice(0, 12)}`}
                                className="h-auto"
                            >
                                {/* ✅ h-full + w-full para que no se “encojan” en mobile */}
                                <div className="h-full w-full">
                                    <Card className="h-full hover:ring-yellow-orange-200">
                                        <Pill tone="orange">Experiencia</Pill>

                                        <p className="mt-4 text-sm text-zinc-700 leading-relaxed">
                                            <span className="text-zinc-400 font-extrabold">“</span>
                                            {t.text}
                                            <span className="text-zinc-400 font-extrabold">”</span>
                                        </p>

                                        <div className="mt-5 flex items-center gap-3">
                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-inset ring-zinc-200">
                                                <ReactCountryFlag
                                                    countryCode={t.countryCode}
                                                    svg
                                                    style={{
                                                        width: "16px",
                                                        height: "16px",
                                                        borderRadius: "999px",
                                                    }}
                                                    aria-label={t.country}
                                                    title={t.country}
                                                />
                                            </span>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 leading-tight truncate">
                                                    {t.name}
                                                </p>
                                                <p className="text-xs text-zinc-500 leading-tight">
                                                    {t.country}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Container>
        </section>
    );
}
