"use client";

import { useEffect, useState } from "react";

export type LevelAvailability = Record<string, Record<string, boolean>>;

// Default = comportamiento histórico hardcodeado. Sirve de fallback si el
// backend no responde, para que el formulario de pago nunca se rompa.
export const DEFAULT_LEVEL_AVAILABILITY: LevelAvailability = {
  Essential: {
    Principiante: true, Basico: true, Intermedio: true,
    "Intermedio alto-gramatica": true, "Intermedio alto-produccion": true,
  },
  Premium: {
    Principiante: true, Basico: true, Intermedio: true,
    "Intermedio alto-gramatica": true, "Intermedio alto-produccion": false,
  },
  Personalizado: {
    Principiante: true, Basico: true, Intermedio: true,
    "Intermedio alto-gramatica": false, "Intermedio alto-produccion": false,
  },
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export function useLevelAvailability() {
  const [availability, setAvailability] = useState<LevelAvailability>(DEFAULT_LEVEL_AVAILABILITY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/config/level-availability`)
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object" && !Array.isArray(data)) setAvailability(data);
      })
      .catch(() => { /* mantiene el default */ })
      .finally(() => setLoading(false));
  }, []);

  // true por defecto: si falta el dato, el nivel se considera disponible para
  // no ocultar opciones por error de configuración.
  const isLevelAvailable = (plan: string, level: string) =>
    availability[plan]?.[level] !== false;

  return { availability, isLevelAvailable, loading };
}
