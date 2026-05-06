'use client';
import Link from "next/link";
import { Container } from "./Container";
import Card from "./Card";
import { TestimonialsSection } from "./Testimonials";
import PreguntasFrecuentes from "./Questions";
import Sesiones from "./Sessions";
import { InfoSessionMini } from "./Infosessionsection";
import PlansSection from "./Plan";
import InicioPage from "@/app/inicio/iniciopage";

export default function HomeClient() {
  return (
    <main className="bg-white">

      <InicioPage />

      <section id="planes">
        <PlansSection onSelectPlan={() => {
          window.location.href = "/paso-uno";
        }} />
      </section>
      <InfoSessionMini />

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
                <Link href="/paso-uno" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm">
                  Comenzar ahora
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <PreguntasFrecuentes />

      <TestimonialsSection />

    </main>
  );
}
