'use client';
import Link from "next/link";
import { Container } from "./Container";
import { TestimonialsSection } from "./Testimonials";
import PreguntasFrecuentes from "./Questions";
import Card from "./Card";
import Pill from "./Pill";
import Sesiones from "./Sessions";
import { useState } from "react";
import PaymentForm from "./Form";
import { InfoSessionSection, InfoSessionMini } from "./Infosessionsection";
import PlansSection from "./Plan";
//import HeroSection from "./HeroSection";

const CALENDLY_SPEAKING_URL =
  process.env.NEXT_PUBLIC_CALENDLY_SPEAKING_URL || "https://calendly.com/lzacademy590/speaking-session";

const CALENDLY_PREMIUM_BY_LEVEL: Record<string, string> = {
  A1: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A1_URL || "https://calendly.com/lzacademy590/a1-daily-classes",
  A2: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A2_URL || "https://calendly.com/lzacademy590/a2-daily-classes",
  B1: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_B1_URL || "https://calendly.com/lzacademy590/b1-daily-classes",
  B2: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_B2_URL || "https://calendly.com/lzacademy590/new-meeting-2",
};

export default function HomeClient() {
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"Essential" | "Personalizado">("Essential");
  const openPremiumLevelModal = () => setIsLevelModalOpen(true);
  const closePremiumLevelModal = () => setIsLevelModalOpen(false);

  const goToPremiumCalendly = (level: "A1" | "A2" | "B1" | "B2") => {
    window.location.href = CALENDLY_PREMIUM_BY_LEVEL[level];
  };

  const goToSpeakingCalendly = () => {
    window.location.href = CALENDLY_SPEAKING_URL;
  };

  return (
    <main className="bg-white">

    
     
      <InfoSessionSection />

      <section id="planes">
        <PlansSection onSelectPlan={(plan) => {
          setSelectedPlan(plan);
          document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
        }} />
      </section>
      <InfoSessionMini />

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

      <TestimonialsSection />

      <section id="form">
        <PaymentForm selectedPlan={selectedPlan} />
      </section>

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
              <button onClick={() => goToPremiumCalendly("B2")} className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition">
                B2 — Intermedio Alto
              </button>
            </div>
            <p className="mt-4 text-xs text-zinc-500">Si no estás seguro, elige el más cercano; luego podemos ajustarlo.</p>
          </div>
        </div>
      )}

    </main>
  );
}