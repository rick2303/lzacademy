'use client';
import Head from "next/head";
import Link from "next/link";
import { Container } from "./components/Container";
import { TestimonialsSection } from "./components/Testimonials";
import PreguntasFrecuentes from "./components/Questions";
import Card from "./components/Card";
import Pill from "./components/Pill";
import Sesiones from "./components/Sessions";
import { useState, useEffect } from "react";
import PaymentForm from "./components/Form";

const CALENDLY_SPEAKING_URL =
  process.env.NEXT_PUBLIC_CALENDLY_SPEAKING_URL || "https://calendly.com/lzacademy590/speaking-session";

const CALENDLY_PREMIUM_BY_LEVEL: Record<string, string> = {
  A1: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A1_URL || "https://calendly.com/lzacademy590/a1-daily-classes",
  A2: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A2_URL || "https://calendly.com/lzacademy590/a2-daily-classes",
  B1: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_B1_URL || "https://calendly.com/lzacademy590/b1-daily-classes",
  //B2: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_B2_URL || "https://calendly.com/lzacademy590/b2-daily-classes",
};


export default function Page() {
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  const openPremiumLevelModal = () => setIsLevelModalOpen(true);
  const closePremiumLevelModal = () => setIsLevelModalOpen(false);

  const goToPremiumCalendly = (level: "A1" | "A2" | "B1") => {
    const url = CALENDLY_PREMIUM_BY_LEVEL[level];
    window.location.href = url;
  };

  const goToSpeakingCalendly = () => {
    window.location.href = CALENDLY_SPEAKING_URL;
  };

  return (
    <>
      {/* --- SEO HEAD --- */}
      <Head>
        <title>LZ English Academy | Aprende inglés rápido y con propósito</title>
        <meta
          name="description"
          content="Aprende inglés en 90 días con LZ English Academy usando el Método 590. Sesiones diarias, speaking real y planes Essential y Premium adaptados a tu nivel."
        />
        <meta
          name="keywords"
          content="LZ English Academy, aprender inglés rápido, Método 590, QALI-T, speaking real, fluidez, plan essential, plan premium, clases online"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://lz-englishacademy.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="LZ English Academy | Aprende inglés rápido y con propósito" />
        <meta
          property="og:description"
          content="Transforma tu inglés en 90 días con el Método 590 en LZ English Academy: sesiones guiadas, speaking real y planes adaptados a tu nivel. By QALI-T."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lz-englishacademy.com/" />
        <meta property="og:image" content="https://lz-englishacademy.com/og-image.jpg" />
        <meta property="og:site_name" content="LZ English Academy" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LZ English Academy | Aprende inglés rápido y con propósito" />
        <meta
          name="twitter:description"
          content="Transforma tu inglés en 90 días con el Método 590 en LZ English Academy: sesiones guiadas, speaking real y planes adaptados a tu nivel. By QALI-T."
        />
        <meta name="twitter:image" content="https://lz-englishacademy.com/og-image.jpg" />
      </Head>
      <main className="bg-white">

        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* Fondo con más rojo */}
          <div className="absolute inset-0 bg-linear-to-b from-falu-red-100 via-white to-falu-red-50" />

          {/* Vectores / ornamentos */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-104 w-104 -translate-x-1/2 rounded-full bg-falu-red-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-24 h-120 w-120 rounded-full bg-yellow-orange-300/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,rgba(156,24,29,0.35)_1px,transparent_0)] bg-size-[18px_18px]" />

          {/* Wave roja */}
          <svg
            className="pointer-events-none absolute -bottom-px left-0 w-full"
            viewBox="0 0 1440 120"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 80C120 70 240 55 360 52C480 48 600 64 720 72C840 80 960 78 1080 62C1200 46 1320 18 1440 10V120H0V80Z"
              fill="rgba(156,24,29,0.06)"
            />
          </svg>

          <Container>
            <div className="relative py-16 sm:py-24">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <Pill tone="falu">Aprende inglés en 90 días</Pill>

                  <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
                    <span className="block">Con método.</span>
                    <span className="block">Con ciencia.</span>
                    <span className="block text-falu-red-800">Con propósito.</span>
                  </h1>

                  <p className="mt-5 max-w-2xl text-base text-zinc-700 sm:text-lg">
                    El Método 590 convierte el inglés en una rutina diaria estructurada
                    para construir fluidez real.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#planes"
                      className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition shadow-sm"
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

                  {/* Mini stats (más rojo) */}
                  <div className="mt-10 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-falu-red-200/70">
                      <span className="h-2 w-2 rounded-full bg-falu-red-600" />
                      Rutina diaria guiada
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-falu-red-200/70">
                      <span className="h-2 w-2 rounded-full bg-falu-red-600" />
                      5 sesiones por día
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-falu-red-200/70">
                      <span className="h-2 w-2 rounded-full bg-falu-red-600" />
                      Progreso semanal
                    </span>
                  </div>
                </div>

                {/* Panel visual derecha (lenguaje visual) */}
                <div className="lg:col-span-5">
                  <Card className="relative overflow-hidden ring-falu-red-200">
                    <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-falu-red-300/25 blur-3xl" />
                    <div className="absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-yellow-orange-300/15 blur-3xl" />

                    <p className="text-sm font-semibold text-zinc-900">
                      ¿Qué cambia cuando sigues un plan?
                    </p>

                    <div className="mt-4 space-y-3 text-sm text-zinc-700">
                      <div className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />
                        Menos improvisación, más avance.
                      </div>
                      <div className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />
                        Speaking sin miedo (paso a paso).
                      </div>
                      <div className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />
                        Rutina ligera, constante.
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        href="/sesiones"
                        className="text-sm font-semibold text-falu-red-800 hover:text-falu-red-900"
                      >
                        Ver las sesiones →
                      </Link>
                    </div>
                  </Card>
                </div>
              </div>

              {/* 3 highlights */}
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="p-5 hover:ring-falu-red-200">
                  <p className="text-sm font-semibold text-falu-red-900">Estructura diaria</p>
                  <p className="mt-1 text-sm text-zinc-600">Rutina clara para avanzar sin improvisar.</p>
                </Card>

                <Card className="p-5 hover:ring-falu-red-200">
                  <p className="text-sm font-semibold text-falu-red-900">Ciencia cognitiva</p>
                  <p className="mt-1 text-sm text-zinc-600">Ritmo + repetición + consistencia.</p>
                </Card>

                <Card className="p-5 hover:ring-falu-red-200">
                  <p className="text-sm font-semibold text-falu-red-900">Producción real</p>
                  <p className="mt-1 text-sm text-zinc-600">Speaking + journaling con feedback.</p>
                </Card>
              </div>
            </div>
          </Container>
        </section>
        <section id="planes" className="bg-white py-16 sm:py-20">
          <Container>
            <h2 className="text-3xl font-extrabold text-center text-zinc-900"> Elige el plan que se adapta a tu ritmo y objetivo </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Curso Essential */}
              <Card className="flex flex-col justify-between">
                <h3 className="text-xl font-extrabold text-zinc-900">Curso Essential</h3>
                <p className="mt-2 text-sm text-zinc-600">El plan Essential es perfecto si quieres aprender inglés de forma flexible pero con una estructura clara.</p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Acceso completo a la plataforma </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Acceso a tu propia comunidad en whatsapp </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Todo el material organizado por sesiones según el nivel </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Método paso a paso para guiar tu aprendizaje diario </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Reuniones de práctica todos los viernes con diferentes horarios disponibles para tu comodidad.</li> <br></br>
                  <p className="mt-2 text-sm text-zinc-600">Este plan es 80% autodidacta, ideal para personas disciplinadas que quieren avanzar con apoyo.</p>
                </ul>
                <p className="mt-4 text-lg font-semibold text-falu-red-800">$10/mes</p>
                <div className="mt-4">
                  <a href="#form"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm" > Seleccionar $10/mes </a>
                </div>
              </Card>
              {/* Curso Premium */}
              <Card className="flex flex-col justify-between">
                <h3 className="text-xl font-extrabold text-zinc-900">Curso Premium</h3>
                <p className="mt-2 text-sm text-zinc-600">Si quieres mayor acompañamiento y más práctica hablada, el Plan Premium es para ti.</p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" />Todo lo del plan Essential, más:
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" />1 hora de clase diaria (lunes a jueves)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" />Repasos los viernes para resolver dudas y practicar lo visto en la semana.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Explicación clara de teoría</li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Práctica guiada en cada clase</li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Seguimiento y motivación constante</li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Guía para completar correctamente el resto de tus sesiones diarias </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Estructura diseñada para lograr fluidez en menos tiempo</li>
                </ul>
                <p className="mt-2 text-sm text-zinc-600">Agendas tu clase el lunes según tu nivel, ese será tu horario fijo de lunes a jueves</p>

                <p className="mt-4 text-lg font-semibold text-falu-red-800">$50/mes</p>
                <div className="mt-4">
                  <a href="#form"
                    onClick={(e) => {
                      e.preventDefault();
                      openPremiumLevelModal();
                    }}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm" > Seleccionar $50/mes </a> </div> </Card>
              {/* Sesión Speaking */}

              <Card className="flex flex-col justify-between">
                <h3 className="text-xl font-extrabold text-zinc-900">Sesión de Speaking</h3>
                <p className="mt-2 text-sm text-zinc-600">¿Quieres hablar inglés con más confianza, mejor pronunciación y menos errores?
                  La Sesión de Speaking está diseñada para ayudarte a avanzar rápidamente a través de la conversación real.</p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Conversaremos según tu nivel de inglés</li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Corregiremos tu gramática en tiempo real </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Mejoraremos tu pronunciación </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Te daremos herramientas y estrategias para hablar con mayor fluidez y seguridad</li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-falu-red-600" /> Duración: 30 minutos </li>
                </ul>
                <p className="mt-2 text-sm text-zinc-600">En algunos casos la sesión puede extenderse un poco más, y no se te cobrará extra. Ideal si quieres mejorar rápido tu speaking y ganar confianza al hablar.</p>

                <p className="mt-4 text-lg font-semibold text-falu-red-800">$20</p>
                <div className="mt-4">
                  <a href="#form" onClick={(e) => {
                    e.preventDefault();
                    goToSpeakingCalendly();
                  }} className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm" > Reservar sesión $20 </a>
                </div>
              </Card>
            </div>
          </Container> </section >

        {/* creadora */}
        < section className="relative py-14 sm:py-18" >
          {/* fondo rojo suave */}
          < div className="absolute inset-0 bg-linear-to-b from-falu-red-50/60 via-white to-white" />
          <div className="pointer-events-none absolute -right-30 top-10 h-72 w-72 rounded-full bg-falu-red-300/18 blur-3xl" />

          <Container>
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <Pill tone="falu">La fundadora</Pill>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  El método nació de una{" "}
                  <span className="text-falu-red-800">necesidad real</span>
                </h2>
                <p className="mt-4 text-zinc-600">
                  La creadora necesitaba aprender inglés en 3 meses para una entrevista completa en inglés.
                  Así nació una rutina estructurada en 5 sesiones diarias.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/historia"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm"
                  >
                    Conocer su historia
                  </Link>

                  <Link
                    href="/metodo"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                  >
                    Ver el método completo
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <Card className="relative overflow-hidden ring-falu-red-200 hover:ring-falu-red-300">
                  <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-falu-red-300/22 blur-3xl" />
                  <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-falu-red-400/16 blur-3xl" />

                  <p className="text-sm font-semibold text-zinc-900">¿Qué vas a vivir en el método?</p>

                  <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                    <li className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />
                      5 sesiones diarias con propósito
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />
                      Speaking real + journaling con feedback
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />
                      Progreso visible semana a semana
                    </li>
                  </ul>

                  <div className="mt-6">
                    <Link
                      href="/como-funciona"
                      className="text-sm font-semibold text-falu-red-800 hover:text-falu-red-900"
                    >
                      Ver detalle de sesiones →
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section >

        <Sesiones />

        {/* TESTIMONIOS */}
        <TestimonialsSection />

        {/* CTA FINAL */}
        <section className="relative py-16 sm:py-20">
          {/* rojo como protagonista */}
          <div className="absolute inset-0 bg-linear-to-b from-falu-red-50 via-white to-falu-red-50/40" />

          <Container>
            <Card className="relative overflow-hidden ring-falu-red-200">
              <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-falu-red-300/18 blur-3xl" />
              <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-falu-red-400/14 blur-3xl" />

              <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    ¿Listo para comenzar tu proceso?
                  </h2>
                  <p className="mt-3 text-zinc-600">
                    Selecciona el plan que mejor se adapte a tus necesidades, nuestro equipo te orientará para comenzar.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <a
                    href="#form"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-yellow-orange-700 transition shadow-sm"
                  >
                    Ir al formulario
                  </a>
                  <Link
                    href="#planes"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </Card>
          </Container>
        </section>

        {/* PREGUNTAS FRECUENTES */}
        <PreguntasFrecuentes />
        {/* FORMULARIO */}
        <section id="form">
          <PaymentForm selectedPlan="Essential" /> {/* Pasamos el plan seleccionado */}
        </section>


        {/* Modal para seleccionar nivel del plan Premium */}
        {isLevelModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            onClick={closePremiumLevelModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Modal */}
            <div
              className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-falu-red-200 p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-900">Elige tu nivel de inglés</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    Te llevaremos al Calendly correcto para tu plan Premium.
                  </p>
                </div>

                <button
                  onClick={closePremiumLevelModal}
                  className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => goToPremiumCalendly("A1")}
                  className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition"
                >
                  A1 — Principiante
                </button>

                <button
                  onClick={() => goToPremiumCalendly("A2")}
                  className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition"
                >
                  A2 — Básico
                </button>

                <button
                  onClick={() => goToPremiumCalendly("B1")}
                  className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition"
                >
                  B1 — Intermedio
                </button>
                {/* El nivel B2 está temporalmente deshabilitado, por eso se comenta el botón correspondiente. */}
                {/*
              <button
                onClick={() => goToPremiumCalendly("B2")}
                className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition"
              >
                B2 — Intermedio alto
              </button> 
              */}
              </div>

              <p className="mt-4 text-xs text-zinc-500">
                Si no estás seguro, elige el más cercano; luego podemos ajustarlo.
              </p>
            </div>
          </div>
        )}


      </main >
    </>
  );
}
