'use client';
import Head from "next/head";
import Link from "next/link";
import { Container } from "./components/Container";
import { TestimonialsSection } from "./components/Testimonials";
import PreguntasFrecuentes from "./components/Questions";
import Card from "./components/Card";
import Pill from "./components/Pill";
import Sesiones from "./components/Sessions";
import { useState } from "react";
import PaymentForm from "./components/Form";

const CALENDLY_SPEAKING_URL =
  process.env.NEXT_PUBLIC_CALENDLY_SPEAKING_URL || "https://calendly.com/lzacademy590/speaking-session";

const CALENDLY_PREMIUM_BY_LEVEL: Record<string, string> = {
  A1: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A1_URL || "https://calendly.com/lzacademy590/a1-daily-classes",
  A2: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A2_URL || "https://calendly.com/lzacademy590/a2-daily-classes",
  B1: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_B1_URL || "https://calendly.com/lzacademy590/b1-daily-classes",
};

// ─── Actualizar estas fechas cuando cambien ───────────────────────────────────
const NEXT_START = "6 de abril, 2026";

export default function Page() {
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  const openPremiumLevelModal = () => setIsLevelModalOpen(true);
  const closePremiumLevelModal = () => setIsLevelModalOpen(false);

  const goToPremiumCalendly = (level: "A1" | "A2" | "B1") => {
    window.location.href = CALENDLY_PREMIUM_BY_LEVEL[level];
  };

  const goToSpeakingCalendly = () => {
    window.location.href = CALENDLY_SPEAKING_URL;
  };

  return (
    <>
      {/* ── SEO HEAD ── sin cambios ─────────────────────────────────────────── */}
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
        <meta property="og:title" content="LZ English Academy | Aprende inglés rápido y con propósito" />
        <meta property="og:description" content="Transforma tu inglés en 90 días con el Método 590 en LZ English Academy: sesiones guiadas, speaking real y planes adaptados a tu nivel. By QALI-T." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lz-englishacademy.com/" />
        <meta property="og:image" content="https://lz-englishacademy.com/og-image.jpg" />
        <meta property="og:site_name" content="LZ English Academy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LZ English Academy | Aprende inglés rápido y con propósito" />
        <meta name="twitter:description" content="Transforma tu inglés en 90 días con el Método 590 en LZ English Academy: sesiones guiadas, speaking real y planes adaptados a tu nivel. By QALI-T." />
        <meta name="twitter:image" content="https://lz-englishacademy.com/og-image.jpg" />
      </Head>

      <main className="bg-white">

        {/* ══════════════════════════════════════════════════════════════════
            HERO — Opción B: headline intacto + mejoras alrededor
            CAMBIOS vs original:
              1. Badge de fecha con punto verde pulsante (reemplaza Pill)
              2. Texto de próximo inicio con fecha real (no genérico)
              3. CTA primario añade "— desde $10/mes"
              4. Card derecha: cita de Loren + stats 2x2 (reemplaza bullets)
              5. Mini badges: países reales con alumnos (reemplaza los 3 genéricos)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Fondos — sin cambios */}
          <div className="absolute inset-0 bg-linear-to-b from-falu-red-100 via-white to-falu-red-50" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-104 w-104 -translate-x-1/2 rounded-full bg-falu-red-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-24 h-120 w-120 rounded-full bg-yellow-orange-300/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,rgba(156,24,29,0.35)_1px,transparent_0)] bg-size-[18px_18px]" />
          <svg className="pointer-events-none absolute -bottom-px left-0 w-full" viewBox="0 0 1440 120" fill="none" aria-hidden="true">
            <path d="M0 80C120 70 240 55 360 52C480 48 600 64 720 72C840 80 960 78 1080 62C1200 46 1320 18 1440 10V120H0V80Z" fill="rgba(156,24,29,0.06)" />
          </svg>

          <Container>
            <div className="relative py-16 sm:py-24">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

                {/* ── Columna izquierda ─────────────────────────────────── */}
                <div className="lg:col-span-7">

                  {/* CAMBIO 1: Badge de fecha con punto verde pulsante
                      Original: <Pill tone="falu">Aprende inglés en 90 días</Pill> */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-falu-red-200/80">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Próximo inicio: {NEXT_START}
                  </div>

                  {/* Headline — INTACTO, no se toca */}
                  <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
                    <span className="block">Con método.</span>
                    <span className="block">Con ciencia.</span>
                    <span className="block text-falu-red-800">Con propósito.</span>
                  </h1>

                  {/* Subheadline — sin cambios */}
                  <p className="mt-5 max-w-2xl text-base text-zinc-700 sm:text-lg">
                    El Método 590 convierte el inglés en una rutina diaria estructurada
                    para construir fluidez real.
                  </p>

                  {/* CAMBIO 2: Fecha real en lugar de texto genérico
                      Original: <p className="mt-3 text-sm text-falu-red-800 font-medium">
                                  Próximo inicio disponible según fecha seleccionada al inscribirte.
                                </p> */}
                  <p className="mt-3 text-sm text-zinc-500">
                    De cero a nivel B1 conversacional en 90 días — con 5 sesiones diarias.
                  </p>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    {/* CAMBIO 3: CTA más específico con precio visible
                        Original: "Reservar mi cupo" */}
                    <a
                      href="#planes"
                      className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition shadow-sm"
                    >
                      Reservar mi cupo — desde $10/mes
                    </a>
                    <Link
                      href="/metodo"
                      className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                    >
                      Ver el método
                    </Link>
                  </div>

                  {/* CAMBIO 5: Países reales en lugar de badges genéricos
                      Original: "Rutina diaria guiada", "5 sesiones por día", "Progreso semanal" */}
                  <div className="mt-10 flex flex-wrap gap-2">
                    {[
                      "México", "Colombia", "Estados Unidos", "Honduras",
                      "Ecuador", "Perú", "Venezuela", "Argentina",
                      "Guatemala", "El Salvador", "Costa Rica", "Nicaragua",
                      "Chile", "Bolivia", "Puerto Rico", "Rep. Dominicana",
                      "España", "Canadá",
                    ].map((pais) => (
                      <span
                        key={pais}
                        className="inline-flex items-center gap-1.5 rounded-2xl bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200/80"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-falu-red-500" />
                        {pais}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Columna derecha ───────────────────────────────────── */}
                {/* CAMBIO 4: Card con cita de Loren + stats reales
                    Original: card de bullets genéricos ("¿Qué cambia cuando sigues un plan?") */}
                <div className="lg:col-span-5 flex flex-col gap-4">

                  {/* Card con cita de Loren */}
                  <Card className="relative overflow-hidden ring-falu-red-200">
                    <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-falu-red-300/20 blur-3xl" />
                    <div className="relative flex items-start gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-falu-red-100 flex items-center justify-center text-sm font-bold text-falu-red-800">
                        LL
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">Loren Laínez</p>
                        <p className="text-xs text-zinc-500">Fundadora · Ingeniería Biomédica, EEUU</p>
                      </div>
                    </div>
                    <blockquote className="relative mt-4 text-sm text-zinc-700 leading-relaxed border-l-2 border-falu-red-200 pl-3">
                      "Todas las academias me dijeron que era imposible aprender inglés en 3 meses.
                      Diseñé mi propio método y pasé la entrevista. Ese método es el 590."
                    </blockquote>
                    <div className="relative mt-4">
                      <Link
                        href="/historia"
                        className="text-xs font-semibold text-falu-red-800 hover:text-falu-red-900"
                      >
                        Leer la historia completa →
                      </Link>
                    </div>
                  </Card>

                  {/* Stats en grid 2x2 */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "90 días", label: "de cero a B1" },
                      { value: "$10/mes", label: "plan Essential" },
                      { value: "5 sesiones", label: "diarias" },
                      { value: "19 países", label: "con alumnos activos" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl bg-white/80 px-4 py-3 ring-1 ring-inset ring-falu-red-100 text-center"
                      >
                        <p className="text-lg font-extrabold text-zinc-900">{stat.value}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 highlights — sin cambios */}
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

        {/* ══════════════════════════════════════════════════════════════════
            PLANES — rediseño visual cohesivo con la marca
        ══════════════════════════════════════════════════════════════════ */}
        <section id="planes" className="relative py-16 sm:py-20 overflow-hidden">
          {/* Fondo con textura sutil */}
          <div className="absolute inset-0 bg-zinc-50" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.8)_1px,transparent_0)] bg-size-[20px_20px]" />
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-falu-red-200/30 blur-3xl" />

          <Container>

            {/* Encabezado */}
            <div className="relative text-center mb-12">
              <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
                Elige el plan que se adapta a tu ritmo y objetivo
              </h2>
              <p className="mt-3 text-sm text-zinc-500">
                Próximo inicio:{" "}
                <span className="font-semibold text-zinc-700">{NEXT_START}</span>
                {" · "}
                <span className="font-semibold text-zinc-700">4 de mayo, 2026</span>
              </p>
            </div>

            {/* Grid de planes */}
            <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-3">

              {/* ── ESSENTIAL ──────────────────────────────────────────── */}
              <div className="group relative rounded-2xl bg-white ring-1 ring-zinc-200 hover:ring-falu-red-200 transition-all duration-200 overflow-hidden flex flex-col">
                {/* Banda de color superior */}
                <div className="h-1.5 w-full bg-zinc-200 group-hover:bg-falu-red-200 transition-colors" />

                <div className="p-7 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Essential
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold text-zinc-900">
                        Curso Essential
                      </h3>
                    </div>
                    <div className="shrink-0 rounded-xl bg-zinc-50 px-3 py-2 text-center ring-1 ring-zinc-200">
                      <p className="text-2xl font-extrabold text-zinc-900 leading-none">$10</p>
                      <p className="text-xs text-zinc-400 mt-0.5">/ mes</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
                    Perfecto si quieres aprender inglés de forma flexible pero con una estructura clara. 80% autodidacta.
                  </p>

                  {/* Divisor */}
                  <div className="my-5 border-t border-zinc-100" />

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {[
                      "Acceso completo a la plataforma",
                      "Comunidad en WhatsApp",
                      "Material organizado por sesiones y nivel",
                      "Método paso a paso para guiar tu aprendizaje diario",
                      "Reuniones de práctica todos los viernes",
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

                  <p className="mt-4 text-xs text-zinc-400 italic">
                    Inicia en la fecha que selecciones en el formulario.
                  </p>

                  {/* CTA */}
                  <a
                    href="#form"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 hover:ring-zinc-400 transition"
                  >
                    Reservar Essential — $10/mes
                  </a>
                </div>
              </div>

              {/* ── PREMIUM — destacado ─────────────────────────────────── */}
              <div className="relative rounded-2xl overflow-hidden flex flex-col shadow-xl shadow-falu-red-900/10">
                {/* Fondo rojo oscuro */}
                <div className="absolute inset-0 bg-linear-to-b from-falu-red-800 to-falu-red-900" />
                <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-yellow-orange-300/10 blur-2xl" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,1)_1px,transparent_0)] bg-size-[16px_16px]" />

                {/* Badge flotante */}
                <div className="relative px-7 pt-6 pb-0">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-orange-300 animate-pulse" />
                    Más completo
                  </div>
                </div>

                <div className="relative p-7 pt-4 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                        Premium
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold text-white">
                        Curso Premium
                      </h3>
                    </div>
                    <div className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                      <p className="text-2xl font-extrabold text-white leading-none">$50</p>
                      <p className="text-xs text-white/50 mt-0.5">/ mes</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-white/70 leading-relaxed">
                    Todo el Essential más clases diarias en vivo y seguimiento personalizado. Diseñado para lograr fluidez en menos tiempo.
                  </p>

                  {/* Divisor */}
                  <div className="my-5 border-t border-white/10" />

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {[
                      "Todo lo del plan Essential",
                      "1 hora de clase diaria (lunes a jueves)",
                      "Repasos los viernes para resolver dudas",
                      "Explicación clara de teoría",
                      "Práctica guiada en cada clase",
                      "Seguimiento y motivación constante",
                      "Guía para completar tus sesiones diarias",
                      "Estructura diseñada para lograr fluidez en menos tiempo",
                    ].map((item, i) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                        <svg className={`mt-0.5 h-4 w-4 shrink-0 ${i === 0 ? "text-yellow-orange-300" : "text-green-400"}`} viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
                          <path d="M4.5 8l2.5 2.5L11.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-xs text-white/40 italic">
                    Agendas tu clase el lunes según tu nivel — horario fijo lunes a jueves.
                  </p>

                  {/* CTA */}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); openPremiumLevelModal(); }}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-900 bg-white hover:bg-zinc-50 transition shadow-sm"
                  >
                    Seleccionar Premium — $50/mes
                  </a>
                </div>
              </div>

              {/* ── SPEAKING ────────────────────────────────────────────── */}
              <div className="group relative rounded-2xl bg-white ring-1 ring-zinc-200 hover:ring-falu-red-200 transition-all duration-200 overflow-hidden flex flex-col">
                {/* Banda de color superior */}
                <div className="h-1.5 w-full bg-zinc-200 group-hover:bg-falu-red-200 transition-colors" />

                <div className="p-7 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Speaking
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold text-zinc-900">
                        Sesión de Speaking
                      </h3>
                    </div>
                    <div className="shrink-0 rounded-xl bg-zinc-50 px-3 py-2 text-center ring-1 ring-zinc-200">
                      <p className="text-2xl font-extrabold text-zinc-900 leading-none">$15</p>
                      <p className="text-xs text-zinc-400 mt-0.5">/ sesión</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
                    Sesión 1:1 de 30 minutos enfocada en conversación real, pronunciación y corrección en tiempo real.
                  </p>

                  {/* Divisor */}
                  <div className="my-5 border-t border-zinc-100" />

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {[
                      "Conversaremos según tu nivel de inglés",
                      "Corregiremos tu gramática en tiempo real",
                      "Mejoraremos tu pronunciación",
                      "Herramientas para hablar con mayor fluidez y seguridad",
                      "Duración: 30 minutos (puede extenderse sin costo extra)",
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

                  <p className="mt-4 text-xs text-zinc-400 italic">
                    * Miembros de la Academia reciben esta sesión con descuento.
                  </p>

                  {/* CTA */}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); goToSpeakingCalendly(); }}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 hover:ring-zinc-400 transition"
                  >
                    Reservar sesión — $15
                  </a>
                </div>
              </div>

            </div>

            {/* Nota inferior */}
            <p className="relative mt-8 text-center text-xs text-zinc-400">
              Todos los planes incluyen acceso desde el día de inicio seleccionado. Sin contratos ni compromisos.
            </p>

          </Container>
        </section>

        {/* Creadora */}
        <section className="relative py-14 sm:py-18">
          <div className="absolute inset-0 bg-linear-to-b from-falu-red-50/60 via-white to-white" />
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
                  <Link href="/historia" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm">
                    Conocer su historia
                  </Link>
                  <Link href="/metodo" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition">
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
                    <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />5 sesiones diarias con propósito</li>
                    <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />Speaking real + journaling con feedback</li>
                    <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />Progreso visible semana a semana</li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/como-funciona" className="text-sm font-semibold text-falu-red-800 hover:text-falu-red-900">
                      Ver detalle de sesiones →
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        <Sesiones />

        <TestimonialsSection />

        {/* CTA Final */}
        <section className="relative py-16 sm:py-20">
          <div className="absolute inset-0 bg-linear-to-b from-falu-red-50 via-white to-falu-red-50/40" />
          <Container>
            <Card className="relative overflow-hidden ring-falu-red-200">
              <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-falu-red-300/18 blur-3xl" />
              <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-falu-red-400/14 blur-3xl" />
              <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">¿Listo para reservar tu cupo?</h2>
                  <p className="mt-3 text-zinc-600">Selecciona tu plan y reserva tu cupo en el próximo inicio disponible.</p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <a href="#form" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm">
                    Ir al formulario
                  </a>
                  <Link href="#planes" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition">
                    Ver detalles
                  </Link>
                </div>
              </div>
            </Card>
          </Container>
        </section>

        <PreguntasFrecuentes />

        <section id="form">
          <PaymentForm selectedPlan="Essential" />
        </section>

        {/* Modal nivel Premium */}
        {isLevelModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            onClick={closePremiumLevelModal}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div
              className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-falu-red-200 p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-900">Elige tu nivel de inglés</h3>
                  <p className="mt-1 text-sm text-zinc-600">Te llevaremos al Calendly correcto para tu plan Premium.</p>
                </div>
                <button onClick={closePremiumLevelModal} className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100" aria-label="Cerrar">
                  ✕
                </button>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => goToPremiumCalendly("A1")} className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition">
                  A1 — Principiante
                </button>
                <button onClick={() => goToPremiumCalendly("A2")} className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition">
                  A2 — Básico
                </button>
                <button onClick={() => goToPremiumCalendly("B1")} className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition">
                  B1 — Intermedio
                </button>
              </div>
              <p className="mt-4 text-xs text-zinc-500">Si no estás seguro, elige el más cercano; luego podemos ajustarlo.</p>
            </div>
          </div>
        )}

      </main>
    </>
  );
}