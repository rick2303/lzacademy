"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import PaymentForm from "@/app/components/Form";
import { CHECKOUT_PLAN_KEYS, PLAN_MAP } from "@/app/lib/plans";

type PlanType = "Essential" | "Premium" | "Personalizado" | "Fluidez";

// URL param (en minúsculas) → key del plan, derivado del catálogo (planes de checkout).
const planMap: Record<string, PlanType> = Object.fromEntries(
  CHECKOUT_PLAN_KEYS.map((k) => [k.toLowerCase(), k])
) as Record<string, PlanType>;

const nivelMap: Record<string, string> = {
  "A1":   "Principiante",
  "A2":   "Basico",
  "B1":   "Intermedio",
  "B2.1": "Intermedio alto-gramatica",
  "B2.2": "Intermedio alto-produccion",
  "?":    "",
};

// Imagen del personaje por plan, derivada del catálogo.
const planCharacter: Record<string, string> = Object.fromEntries(
  CHECKOUT_PLAN_KEYS.map((k) => [k, PLAN_MAP[k].character ?? ""])
);

function PasoCuatroContent() {
  const searchParams = useSearchParams();
  const planParam       = searchParams.get("plan")        ?? "";
  const nivelParam      = searchParams.get("nivel")       ?? "";
  const dificultades    = searchParams.get("dificultades") ?? "";

  const initialPlan: PlanType = planMap[planParam.toLowerCase()] ?? "Essential";
  const nivel: string = nivelMap[nivelParam] ?? "";

  const [activePlan, setActivePlan] = useState<PlanType>(initialPlan);

  return (
    <main
      className="relative min-h-[calc(100dvh-68px)]"
      style={{ backgroundColor: "#fadadd" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #9c181d 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 min-h-[calc(100dvh-68px)]">

          {/* ── Personaje del plan (cambia según el plan activo) ── */}
          <div className="flex items-center justify-center order-2 lg:order-1 pb-6 lg:pb-0">
            <Image
              key={activePlan}
              src={planCharacter[activePlan]}
              alt={`Muñeca ${activePlan}`}
              width={582}
              height={568}
              className="w-auto h-[360px] lg:h-[520px] transition-opacity duration-300 [filter:drop-shadow(-40px_30px_50px_rgba(0,0,0,0.45))]"
              sizes="(max-width: 1024px) 360px, 520px"
              priority
            />
          </div>

          {/* ── Formulario ── */}
          <div className="flex flex-col items-center justify-center py-8 lg:py-10 order-1 lg:order-2">
            <PaymentForm
              selectedPlan={initialPlan}
              selectedNivel={nivel}
              selectedDificultades={dificultades}
              embedded
              onPlanChange={setActivePlan}
            />
          </div>

        </div>
      </div>
    </main>
  );
}

export default function PasoCuatroPage() {
  return (
    <Suspense fallback={null}>
      <PasoCuatroContent />
    </Suspense>
  );
}
