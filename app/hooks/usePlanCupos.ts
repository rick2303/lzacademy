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
// Cada cuánto re-consultar los cupos para que el conteo baje en vivo (reactivo).
const REFRESH_MS = 30_000;

export function usePlanCupos() {
  const [cupos, setCupos] = useState<CuposMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetch(`${BACKEND_URL}/config/plans`, { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled || !Array.isArray(data)) return;
          const map: CuposMap = {};
          for (const p of data) {
            if (p && typeof p === "object" && p.key && p.cupos) map[p.key] = p.cupos;
          }
          setCupos(map);
        })
        .catch(() => { /* fail-open: sin datos de cupos */ })
        .finally(() => { if (!cancelled) setLoading(false); });
    };

    load();
    // Reactivo: re-consulta cada 30s y al volver a enfocar la pestaña, para que
    // los "N cupos disponibles" bajen a medida que se ocupan.
    const id = setInterval(load, REFRESH_MS);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Cupos de un plan, o undefined si el plan no maneja cupos.
  const getCupos = (plan: string): PlanCupos | undefined => cupos[plan];

  // Un plan es visible si NO maneja cupos, o si tiene cupos activos y restantes.
  const isPlanAvailable = (plan: string): boolean => {
    const c = cupos[plan];
    if (!c) return true;
    return c.activo && c.restantes > 0;
  };

  // Etiqueta real de cupos para la card ("" si el plan no maneja cupos o está
  // agotado/desactivado). Muestra el conteo restante y da urgencia al bajar.
  const cuposLabel = (plan: string): string => {
    const c = cupos[plan];
    if (!c || !c.activo || c.restantes <= 0) return "";
    if (c.restantes === 1) return "¡Último cupo!";
    if (c.restantes <= LOW_STOCK_THRESHOLD) return `¡Últimos ${c.restantes} cupos!`;
    return `${c.restantes} cupos disponibles`;
  };

  return { cupos, loading, getCupos, isPlanAvailable, cuposLabel };
}
