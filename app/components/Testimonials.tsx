"use client";

import { Container } from "./Container";
import Pill from "./Pill";
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
        name: "Susan Pérez",
        country: "Guatemala",
        countryCode: "GT",
        text: "Me ayudó a resolver dudas y a ver el inglés de una manera más divertida, sin sentirme presionada ni con miedo a equivocarme.",
    },
    {
        name: "Mónica Alvarado de Paz",
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
        name: "Norma Calderón",
        country: "Estados Unidos",
        countryCode: "US",
        text: "Es el mejor método que he probado. Mejoré mi vocabulario, mi escritura y sobre todo perdí el miedo a hablar. Las docentes te dan la confianza y paciencia que necesitas.",
    },
    {
        name: "Lizbeth Ocampo",
        country: "México",
        countryCode: "MX",
        text: "Nunca había avanzado tanto con otros cursos. La comunidad genera confianza para practicar y como docente confirmo que trabaja las cuatro habilidades: escuchar, hablar, leer y escribir.",
    },
    {
        name: "Brendalix Ortega",
        country: "Colombia",
        countryCode: "CO",
        text: "Aprendí a defenderme en inglés, puedo comunicar, realizar preguntas a otras personas y entender lo que me dicen mis compañeros. Super recomiendo este método y curso.",
    },
    {
        name: "Fatima del Carmen Meza",
        country: "México",
        countryCode: "MX",
        text: "Me encanta, el método es muy dinámico y sencillo de entender y aplicar, siempre te están apoyando y estás en constante mejora en tu vocabulario.",
    },
    {
        name: "Saira Ochoa",
        country: "Colombia",
        countryCode: "CO",
        text: "Me ayudo mucho este curso, estoy perdiendo el miedo para hablar en inglés y también a compartir con otros compañeros. En general me gusta mucho el curso.",
    },
];

export function TestimonialsSection() {
    return (
        <section className="py-14 sm:py-18 bg-white">
            <Container>
                <div className="mx-auto max-w-2xl text-center mb-10">
                    <Pill tone="orange">Testimonios</Pill>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                        Resultados que se sienten
                    </h2>
                    <p className="mt-3 text-zinc-500 text-sm">
                        Confianza, estructura y fluidez real con práctica diaria.
                    </p>
                </div>

                {/* [&_.swiper-slide]:flex makes each slide a flex container so the card stretches to match the tallest */}
                <div className="[&_.swiper-slide]:flex [&_.swiper-slide]:h-auto" style={{ paddingBottom: "32px" }}>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        loop
                        grabCursor
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        spaceBetween={16}
                        style={{ paddingBottom: "32px" }}
                        breakpoints={{
                            640: { slidesPerView: 1.1, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                        }}
                    >
                        {testimonials.map((t) => (
                            <SwiperSlide key={`${t.name}-${t.countryCode}`}>
                                <div className="flex flex-col bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 transition hover:shadow-md w-full">
                                    {/* Stars */}
                                    <div className="flex gap-0.5 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4 text-yellow-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Quote text — line-clamp keeps all cards the same height */}
                                    <p className="text-sm text-zinc-700 leading-relaxed mb-5">
                                        &ldquo;{t.text}&rdquo;
                                    </p>

                                    {/* Author — always at the bottom */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-inset ring-zinc-200 shrink-0">
                                            <ReactCountryFlag
                                                countryCode={t.countryCode}
                                                svg
                                                style={{ width: "16px", height: "16px", borderRadius: "999px" }}
                                                aria-label={t.country}
                                                title={t.country}
                                            />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-zinc-900 truncate">{t.name}</p>
                                            <p className="text-xs text-zinc-400">{t.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Container>
        </section>
    );
}
