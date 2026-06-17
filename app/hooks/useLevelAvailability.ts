"use client";

import { useEffect, useState } from "react";
// Los defaults de disponibilidad de niveles viven en el catálogo único de planes.
import { DEFAULT_LEVEL_AVAILABILITY } from "@/app/lib/plans";

export type LevelAvailability = Record<string, Record<string, boolean>>;

export { DEFAULT_LEVEL_AVAILABILITY };

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
