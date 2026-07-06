"use client";

import Image from "next/image";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PreguntasFrecuentes from "@/app/components/Questions";
import { TestimonialsSection } from "@/app/components/Testimonials";
import { usePlanCupos } from "@/app/hooks/usePlanCupos";

const plans = [
  {
    id: "essential",
    name: "Plan\nEssential",
    subtitle: "Empieza con lo esencial para avanzar rápido:",
    price: "$10",
    priceUnit: "USD / mes",
    billingNote: "Facturación automática cada 4 semanas",
    cardBg: "#fef0f0",
    nameColor: "#C0353E",
    checkColor: "#C0353E",
    backBg: "#C0353E",
    btnColor: "#C0353E",
    popular: false,
    badge: null,
    route: "/essential",
    muñeca: "/muñecapaso3essential.webp",
    features: [
      "Acceso completo al Método 590",
      "Acceso completo a la plataforma",
      "Comunidad en WhatsApp",
      "Material organizado por sesiones y nivel",
      "Método paso a paso",
      "Reuniones de práctica los viernes",
    ],
  },
  {
    id: "premium",
    name: "Plan\nPremium",
    subtitle: "Todo lo de Essential, más:",
    price: "$50",
    priceUnit: "USD / mes",
    billingNote: "Facturación automática cada 4 semanas",
    cardBg: "#bf3d6d",
    nameColor: "#fff",
    checkColor: "#fff",
    backBg: "#d63060",
    btnColor: "#d63060",
    popular: true,
    badge: { text: "Recomendado", bg: "#f5d9a0", color: "#7a4a00" },
    route: "/premium",
    muñeca: "/muñecapaso3premium.webp",
    features: [
      "Acceso completo al Método 590",
      "1 hora de clase diaria (lunes a jueves)",
      "Repasos los viernes para resolver dudas",
      "Explicación clara de teoría",
      "Práctica guiada en cada clase",
      "Práctica hablada diaria",
      "Seguimiento y motivación constante",
      "Guía para completar tus sesiones diarias",
      "Estructura para lograr fluidez en menos tiempo",
    ],
  },
  {
    id: "personalizada",
    name: "Plan\nPersonalizado",
    subtitle: "Todo lo de Premium, más:",
    price: "$120",
    priceUnit: "USD pago único",
    billingNote: null,
    cardBg: "#a02845",
    nameColor: "#fff",
    checkColor: "#fff",
    backBg: "#9c1a38",
    btnColor: "#9c1a38",
    popular: false,
    badge: { text: "Solo para ti", bg: "#c7f2e0", color: "#145c3c" },
    route: "/personalizado",
    muñeca: "/muñecapaso3personalizada.webp",
    features: [
      "2 sesiones privadas 1:1 por semana adaptadas a ti",
      "1 sesión de práctica grupal cada viernes",
      "Acceso completo al Método 590",
      "Horario flexible para tus sesiones privadas",
      "Plan de trabajo personalizado desde el día 1",
      "Corrección y feedback en tiempo real",
      "Seguimiento y motivación constante",
      "Avanza a tu ritmo con guía personalizada",
    ],
  },
  {
    id: "fluidez",
    name: "Programa\nde Fluidez",
    subtitle: "Todo lo de Premium, más:",
    price: "$200",
    priceUnit: "USD pago único",
    billingNote: null,
    cardBg: "#8a1f3d",
    nameColor: "#fff",
    checkColor: "#fde68a",
    backBg: "#6d1228",
    btnColor: "#6d1228",
    popular: false,
    badge: { text: "Cupos limitados", bg: "#fde68a", color: "#7a4a00" },
    route: "/fluidez",
    // Placeholder: reutiliza la muñeca de Personalizado hasta tener el asset propio.
    muñeca: "/muñecapaso3personalizada.webp",
    features: [
      "Coaching de speaking 1:1 cada semana",
      "Diagnóstico inicial + plan de acción escrito",
      "Enfoque total en romper la barrera de hablar",
      "Corrección y feedback personalizados en cada sesión",
      "Acceso completo al Método 590",
      "Requiere nivel A2 o superior",
    ],
  },
];

function PasosTresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel") ?? "";
  const dificultades = searchParams.get("dificultades") ?? "";
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [reducedMotion, setReducedMotion] = useState(false);
  const { isPlanAvailable, cuposLabel } = usePlanCupos();

  // Oculta la card de Fluidez si se agotaron los cupos; el resto de planes no
  // manejan cupos y siempre se muestran.
  const visiblePlans = plans.filter((p) => p.id !== "fluidez" || isPlanAvailable("Fluidez"));

  // Texto del badge: para Fluidez usa el conteo real de cupos cuando está disponible.
  function badgeText(plan: (typeof plans)[number]): string | undefined {
    if (plan.id === "fluidez") return cuposLabel("Fluidez") || plan.badge?.text;
    return plan.badge?.text;
  }
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function toggleFlip(id: string) {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSeleccionar(route: string) {
    router.push(
      `${route}?nivel=${encodeURIComponent(nivel)}&dificultades=${encodeURIComponent(dificultades)}`
    );
  }

  function handleVolver() {
    router.back();
  }

  return (
    <main
      className="relative min-h-[calc(100dvh-68px)] overflow-hidden flex flex-col"
      style={{ backgroundColor: "#9c1a38" }}
    >
      {/* Textura de puntos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Título */}
      <div className="relative z-10 w-full flex flex-col items-center pt-8 pb-6 px-4">

        <div className="w-full flex justify-end mb-2">
          <button
            type="button"
            onClick={handleVolver}
            className="inline-flex items-center rounded-2xl px-6 py-2.5 text-[14px] font-bold text-zinc-700 bg-white shadow-sm transition hover:shadow-md active:scale-95"
            style={{ border: "1.5px solid #d4d4d4" }}
          >
            Volver
          </button>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-white/60">
          Paso 3 de 4
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight text-center">
          Elige tu experiencia
        </h1>
        <p className="mt-3 text-[15px] text-white/75 font-medium max-w-2xl text-center">
          Cada plan incluye el Método 590. Elige la intensidad de acompañamiento que necesitas.
        </p>
      </div>

      {/* Cards + Muñecas */}
      <div className="relative z-10 flex-1 flex flex-col">

        {/* ── Cards mobile (sin 3D) ── */}
        <div className="sm:hidden w-full max-w-6xl mx-auto px-4 flex flex-col gap-6">
          {visiblePlans.map((plan) => (
            <div key={plan.id} className="relative">
              {plan.badge && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-[11px] font-extrabold uppercase tracking-widest px-5 py-1.5 rounded-full"
                  style={{ backgroundColor: plan.badge.bg, color: plan.badge.color }}
                >
                  {badgeText(plan)}
                </span>
              )}
              <div
                className="rounded-3xl px-5 py-5 shadow-lg overflow-hidden"
                style={{ backgroundColor: plan.cardBg }}
              >
                {/* Nombre + precio en la misma fila */}
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xl font-extrabold whitespace-pre-line" style={{ color: plan.nameColor }}>
                    {plan.name}
                  </p>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-3xl font-extrabold leading-none" style={{ color: plan.nameColor }}>
                      {plan.price}
                    </p>
                    <p className="text-[11px] font-bold opacity-70 mt-0.5" style={{ color: plan.nameColor }}>
                      {plan.priceUnit}
                    </p>
                    {plan.billingNote && (
                      <p className="text-[10px] font-medium opacity-55 mt-0.5 max-w-[120px] ml-auto leading-tight" style={{ color: plan.nameColor }}>
                        {plan.billingNote}
                      </p>
                    )}
                  </div>
                </div>

                {plan.subtitle && (
                  <p className="text-[11px] font-semibold mb-2 opacity-70" style={{ color: plan.nameColor }}>
                    {plan.subtitle}
                  </p>
                )}

                <ul className="flex flex-col gap-2 mb-4">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span
                        className="shrink-0 mt-0.5 flex items-center justify-center w-4 h-4 rounded-full"
                        style={{ border: `2px solid ${plan.checkColor}` }}
                      >
                        <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none">
                          <polyline points="1.5,5 4,7.5 8.5,2" stroke={plan.checkColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-[13px] font-semibold leading-snug" style={{ color: plan.nameColor }}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleSeleccionar(plan.route)}
                  className="w-full rounded-full py-3 text-[14px] font-extrabold bg-white transition hover:opacity-90 active:scale-95"
                  style={{ color: plan.btnColor }}
                >
                  Seleccionar
                </button>
                <div className="relative h-[180px] mt-3 -mx-5 -mb-5">
                  <Image
                    src={plan.muñeca}
                    alt=""
                    fill
                    className="object-contain object-bottom [filter:drop-shadow(-20px_15px_25px_rgba(0,0,0,0.35))]"
                    sizes="90vw"
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Cards desktop (con flip 3D) ── */}
        <div className="hidden sm:grid w-full max-w-6xl mx-auto px-4 grid-cols-1 sm:grid-cols-2 gap-3">
          {visiblePlans.map((plan) => (
            <div key={plan.id} className="flex flex-col items-center">
              <div
                className="w-full relative"
                style={{ perspective: "1000px", WebkitPerspective: "1000px", height: "400px" }}
              >
                {plan.badge && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-[11px] font-extrabold uppercase tracking-widest px-5 py-1.5 rounded-full"
                    style={{ backgroundColor: plan.badge.bg, color: plan.badge.color }}
                  >
                    {badgeText(plan)}
                  </span>
                )}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver precio del ${plan.name.replace("\n", " ")}`}
                  onClick={() => toggleFlip(plan.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleFlip(plan.id); }}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    transition: reducedMotion ? "none" : "transform 0.4s cubic-bezier(.4,0,.2,1)",
                    transform: flipped[plan.id] ? "rotateY(180deg)" : "rotateY(0deg)",
                    cursor: "pointer",
                    willChange: "transform",
                  }}
                >
                  {/* FRENTE */}
                  <div
                    className="rounded-3xl px-6 py-5 flex flex-col shadow-lg"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: plan.cardBg,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "translateZ(1px)",
                    }}
                  >
                    <p className="text-2xl font-extrabold whitespace-pre-line mb-1" style={{ color: plan.nameColor }}>
                      {plan.name}
                    </p>
                    {plan.subtitle && (
                      <p className="text-[12px] font-semibold mb-2 opacity-70" style={{ color: plan.nameColor }}>
                        {plan.subtitle}
                      </p>
                    )}
                    <ul className="flex flex-col gap-2 flex-1">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span
                            className="shrink-0 mt-0.5 flex items-center justify-center w-4 h-4 rounded-full"
                            style={{ border: `2px solid ${plan.checkColor}` }}
                          >
                            <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none">
                              <polyline points="1.5,5 4,7.5 8.5,2" stroke={plan.checkColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="text-[13px] font-semibold leading-snug" style={{ color: plan.nameColor }}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[13px] font-bold text-center mt-2 opacity-60" style={{ color: plan.nameColor }}>
                      Clic para ver el precio →
                    </p>
                  </div>

                  {/* REVERSO */}
                  <div
                    className="rounded-3xl px-6 py-5 flex flex-col items-center justify-center shadow-lg"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: plan.backBg,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg) translateZ(1px)",
                    }}
                  >
                    <p className="text-[12px] font-extrabold uppercase tracking-widest mb-2 opacity-70" style={{ color: "#fff" }}>
                      {plan.name.replace("\n", " ")}
                    </p>
                    <p className="font-extrabold leading-none" style={{ color: "#fff", fontSize: "76px" }}>
                      {plan.price}
                    </p>
                    <p className="text-[13px] font-bold mt-1 opacity-80" style={{ color: "#fff" }}>
                      {plan.priceUnit}
                    </p>
                    {plan.billingNote && (
                      <p className="text-[11px] font-medium mt-1.5 opacity-60 text-center max-w-[180px]" style={{ color: "#fff" }}>
                        {plan.billingNote}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleSeleccionar(plan.route); }}
                      className="mt-6 inline-flex items-center rounded-full px-7 py-2.5 text-[13px] font-extrabold bg-white transition hover:opacity-90 active:scale-95"
                      style={{ color: plan.btnColor }}
                    >
                      Seleccionar
                    </button>
                    <p className="text-[12px] font-bold mt-3 opacity-50 cursor-pointer" style={{ color: "#fff" }}>
                      ← Ver detalles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fila de muñecas (decorativa) */}
        <div className="hidden sm:grid w-full max-w-6xl mx-auto px-4 grid-cols-4 gap-0 mt-8 flex-1">
          {visiblePlans.map((plan) => (
            <div
              key={plan.id}
              className="relative h-[260px] sm:h-[320px] select-none overflow-hidden"
            >
              <Image
                src={plan.muñeca}
                alt={`Muñeca ${plan.id}`}
                fill
                className="object-contain object-bottom [filter:drop-shadow(-20px_15px_25px_rgba(0,0,0,0.35))]"
                sizes="33vw"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonios */}
      <div className="bg-white">
        <TestimonialsSection />
      </div>

      {/* FAQ */}
      <div className="bg-white">
        <PreguntasFrecuentes />
      </div>

    </main>
  );
}

export default function PasosTresPage() {
  return (
    <Suspense fallback={null}>
      <PasosTresContent />
    </Suspense>
  );
}