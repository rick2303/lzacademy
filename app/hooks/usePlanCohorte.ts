"use client";

import { useEffect, useState } from "react";

// ¿El plan se compra para una fecha de inicio (cohorte) o empieza el mismo día?
//
// La regla NO se declara aquí: se lee de GET /config/plans, que la deriva del
// catálogo único del backend (`src/config/plans.js` → requiresCohort). Si se
// hardcodeara la lista en el frontend habría tres copias de la misma regla
// (backend, frontend y plataforma) y la de en medio se quedaría atrás.
//
// Fail-CERRADO, al revés que useStartDates y usePlanCupos: mientras carga o si
// el fetch falla, se asume que el plan SÍ necesita cohorte. Es la dirección
// segura del error — de más, se le pide una fecha a alguien que no la necesita
// (molesto, reversible); de menos, un Premium compraría sin fecha y sin clase
// agendada, que es un alumno roto y un reembolso.

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

// Si el catálogo no contesta en este tiempo, se sigue sin él (default seguro).
const FETCH_TIMEOUT_MS = 4000;

export function usePlanCohorte() {
  const [map, setMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Techo de espera. El CTA de pago se deshabilita mientras `loading` sea true,
    // así que un fetch que NO falla sino que se QUEDA COLGADO dejaría el botón
    // muerto para todos los planes: una caída del checkout entero por un endpoint
    // secundario. Al abortar, cae en el `catch` y el default seguro (todos con
    // cohorte) deja el formulario en su comportamiento de siempre.
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), FETCH_TIMEOUT_MS);

    fetch(`${BACKEND_URL}/config/plans`, { signal: abort.signal })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        const next: Record<string, boolean> = {};
        for (const p of data) {
          if (p && typeof p === "object" && p.key) {
            // Solo un `false` explícito quita la cohorte. Un backend viejo que
            // todavía no manda el campo deja a todos los planes con cohorte,
            // que es el comportamiento anterior a este cambio.
            next[p.key] = p.requiresCohort !== false;
          }
        }
        setMap(next);
      })
      .catch(() => { /* fail-cerrado: sin datos, todos con cohorte */ })
      .finally(() => { clearTimeout(timer); if (!cancelled) setLoading(false); });

    return () => { cancelled = true; clearTimeout(timer); abort.abort(); };
  }, []);

  const requiresCohort = (plan: string): boolean => map[plan] ?? true;

  return { requiresCohort, loading };
}
