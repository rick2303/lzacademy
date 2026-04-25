"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaymentForm from "@/app/components/Form";

type PlanType = "Essential" | "Premium" | "Personalizado";

const planMap: Record<string, PlanType> = {
  essential:     "Essential",
  premium:       "Premium",
  personalizado: "Personalizado",
};

const nivelMap: Record<string, string> = {
  "A1":  "Principiante",
  "A2":  "Basico",
  "B1":  "Intermedio",
  "B2":  "Intermedio alto-gramatica",
  "B2+": "Intermedio alto-produccion",
  "?":   "",
};

function PasoCuatroContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "";
  const nivelParam = searchParams.get("nivel") ?? "";

  const plan: PlanType = planMap[planParam.toLowerCase()] ?? "Essential";
  const nivel = nivelMap[nivelParam] ?? "";

  return <PaymentForm selectedPlan={plan} selectedNivel={nivel} />;
}

export default function PasoCuatroPage() {
  return (
    <Suspense fallback={null}>
      <PasoCuatroContent />
    </Suspense>
  );
}