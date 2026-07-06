"use client";

import { useEffect, useState } from "react";

// Cupos limitados por plan. El backend adjunta este objeto a cada plan de
// GET /config/plans SOLO si el plan tiene cupos configurados (hoy: Fluidez).
export interface PlanCupos {
  activo: boolean;
  max: number;
  usados: number;
  restantes: number;
}

// Umbral para el copy de urgencia ("Últimos N cupos" vs "Solo N cupos").
const LOW_STOCK_THRESHOLD = 3;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

type CuposMap = Record<string, PlanCupos>;

// Hook que expone los cupos de los planes que los tienen. Fail-open: mientras
// carga o si el fetch falla, los planes se consideran disponibles para no
// ocultar cards por un error de red (el checkout valida server-side de todos modos).
export function usePlanCupos() {
  const [cupos, setCupos] = useState<CuposMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/config/plans`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const map: CuposMap = {};
        for (const p of data) {
          if (p && typeof p === "object" && p.key && p.cupos) map[p.key] = p.cupos;
        }
        setCupos(map);
      })
      .catch(() => { /* fail-open: sin datos de cupos */ })
      .finally(() => setLoading(false));
  }, []);

  // Cupos de un plan, o undefined si el plan no maneja cupos.
  const getCupos = (plan: string): PlanCupos | undefined => cupos[plan];

  // Un plan es visible si NO maneja cupos, o si tiene cupos activos y restantes.
  const isPlanAvailable = (plan: string): boolean => {
    const c = cupos[plan];
    if (!c) return true;
    return c.activo && c.restantes > 0;
  };

  // Etiqueta de escasez para la card ("" si el plan no maneja cupos o no está disponible).
  const cuposLabel = (plan: string): string => {
    const c = cupos[plan];
    if (!c || !c.activo || c.restantes <= 0) return "";
    return c.restantes <= LOW_STOCK_THRESHOLD
      ? `Últimos ${c.restantes} cupos`
      : `Solo ${c.restantes} cupos`;
  };

  return { cupos, loading, getCupos, isPlanAvailable, cuposLabel };
}
