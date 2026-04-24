"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const plans = [
  {
    id: "essential",
    name: "Plan\nEssential",
    price: "$10",
    priceUnit: "USD / mes",
    cardBg: "#fef0f0",
    nameColor: "#C0353E",
    checkColor: "#C0353E",
    backBg: "#C0353E",
    btnColor: "#C0353E",
    popular: false,
    route: "/essential",
    muñeca: "/muñecapaso3essential.svg",
    features: [
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
    price: "$50",
    priceUnit: "USD / mes",
    cardBg: "#f4809a",
    nameColor: "#fff",
    checkColor: "#fff",
    backBg: "#d63060",
    btnColor: "#d63060",
    popular: true,
    route: "/premium",
    muñeca: "/muñecapaso3premium.svg",
    features: [
      "1 hora de clase diaria (lunes a jueves)",
      "Repasos los viernes para resolver dudas",
      "Explicación clara de teoría",
      "Práctica guiada en cada clase",
      "Seguimiento y motivación constante",
      "Guía para completar tus sesiones diarias",
      "Estructura para lograr fluidez en menos tiempo",
    ],
  },
  {
    id: "personalizada",
    name: "Plan\nPersonal",
    price: "$100",
    priceUnit: "USD/mes",
    cardBg: "#e05070",
    nameColor: "#fff",
    checkColor: "#fff",
    backBg: "#9c1a38",
    btnColor: "#9c1a38",
    popular: false,
    route: "/personalizada",
    muñeca: "/muñecapaso3personalizada.svg",
    features: [
      "Sesiones privadas 1:1 adaptadas a ti",
      "Acceso completo al Método 590",
      "Horario 100% flexible",
      "Plan de trabajo personalizado desde el día 1",
      "Seguimiento y motivación constante",
      "Corrección en tiempo real",
      "Avanza exactamente a tu ritmo",
    ],
  },
];

function PasosTresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel") ?? "";
  const dificultades = searchParams.get("dificultades") ?? "";
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

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
      className="relative min-h-[calc(100vh-68px)] overflow-hidden flex flex-col"
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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight text-center">
          Elige tu experiencia
        </h1>
        <p className="mt-3 text-[15px] text-white/75 font-medium max-w-2xl text-center">
          Cada plan incluye el Método 590. Elige la intensidad de acompañamiento que necesitas.
        </p>
      </div>

      {/* Cards + Muñecas */}
      <div className="relative z-10 flex-1 flex flex-col">

        {/* Fila de flip cards */}
        <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3">
          {plans.map((plan) => (
            <div key={plan.id} className="flex flex-col items-center">

              {/* Badge popular */}
              <div className="h-8 flex items-center justify-center mb-1">
                {plan.popular && (
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-widest px-5 py-1.5 rounded-full"
                    style={{ backgroundColor: "#f5d9a0", color: "#7a4a00" }}
                  >
                    MÁS POPULAR
                  </span>
                )}
              </div>

              {/* Flip card container */}
              <div
                className="w-full"
                style={{ perspective: "1000px", height: "300px" }}
              >
                <div
                  onClick={() => toggleFlip(plan.id)}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.55s cubic-bezier(.4,0,.2,1)",
                    transform: flipped[plan.id] ? "rotateY(180deg)" : "rotateY(0deg)",
                    cursor: "pointer",
                  }}
                >
                  {/* FRENTE — features */}
                  <div
                    className="rounded-3xl px-6 py-5 flex flex-col shadow-lg"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: plan.cardBg,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <p
                      className="text-xl font-extrabold whitespace-pre-line mb-3"
                      style={{ color: plan.nameColor }}
                    >
                      {plan.name}
                    </p>
                    <ul className="flex flex-col gap-2 flex-1">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span
                            className="shrink-0 mt-0.5 flex items-center justify-center w-4 h-4 rounded-full"
                            style={{ border: `2px solid ${plan.checkColor}` }}
                          >
                            <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none">
                              <polyline
                                points="1.5,5 4,7.5 8.5,2"
                                stroke={plan.checkColor}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            className="text-[12px] font-semibold leading-snug"
                            style={{ color: plan.nameColor }}
                          >
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p
                      className="text-[11px] font-bold text-center mt-3 opacity-60"
                      style={{ color: plan.nameColor }}
                    >
                      Toca para ver el precio →
                    </p>
                  </div>

                  {/* REVERSO — precio */}
                  <div
                    className="rounded-3xl px-6 py-5 flex flex-col items-center justify-center shadow-lg"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: plan.backBg,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <p
                      className="text-[11px] font-extrabold uppercase tracking-widest mb-2 opacity-70"
                      style={{ color: "#fff" }}
                    >
                      {plan.name.replace("\n", " ")}
                    </p>
                    <p
                      className="font-extrabold leading-none"
                      style={{ color: "#fff", fontSize: "64px" }}
                    >
                      {plan.price}
                    </p>
                    <p
                      className="text-[12px] font-bold mt-1 opacity-80"
                      style={{ color: "#fff" }}
                    >
                      {plan.priceUnit}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeleccionar(plan.route);
                      }}
                      className="mt-6 inline-flex items-center rounded-full px-7 py-2.5 text-[13px] font-extrabold bg-white transition hover:opacity-90 active:scale-95"
                      style={{ color: plan.btnColor }}
                    >
                      Seleccionar
                    </button>
                    <p
                      className="text-[11px] font-bold mt-3 opacity-50 cursor-pointer"
                      style={{ color: "#fff" }}
                    >
                      ← Ver detalles
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Fila de muñecas */}
        <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-3 gap-0 mt-2 flex-1">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative h-[260px] sm:h-[320px] select-none overflow-hidden"
            >
              <Image
                src={plan.muñeca}
                alt={`Muñeca ${plan.id}`}
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botón Volver */}
      <div className="absolute top-4 right-6 z-20">
        <button
          type="button"
          onClick={handleVolver}
          className="inline-flex items-center rounded-2xl px-6 py-2.5 text-[14px] font-bold text-zinc-700 bg-white shadow-sm transition hover:shadow-md active:scale-95"
          style={{ border: "1.5px solid #d4d4d4" }}
        >
          Volver
        </button>
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