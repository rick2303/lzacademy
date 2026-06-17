"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ErrorState } from "../_utils/ErrorState";
import { LEVELED_PLAN_KEYS, planLabel, planBadgeClass } from "@/app/lib/plans";

type Availability = Record<string, Record<string, boolean>>;

// Planes con niveles y su presentación: derivados del catálogo único de planes.
const PLANS = LEVELED_PLAN_KEYS;

const PLAN_META: Record<string, { label: string; chip: string }> = Object.fromEntries(
  PLANS.map((p) => [p, { label: planLabel(p), chip: planBadgeClass(p) }])
);

const LEVELS: { value: string; label: string }[] = [
  { value: "Principiante",                label: "Principiante (A1)" },
  { value: "Basico",                      label: "Básico (A2)" },
  { value: "Intermedio",                  label: "Intermedio (B1)" },
  { value: "Intermedio alto-gramatica",   label: "Intermedio alto (B2.1)" },
  { value: "Intermedio alto-produccion",  label: "Intermedio alto (B2.2)" },
];

export default function NivelesPage() {
  const router = useRouter();

  const [availability, setAvailability] = useState<Availability>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${base}/config/level-availability`);
      if (!res.ok) throw new Error(`Error cargando niveles (${res.status})`);
      setAvailability(await res.json());
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Error de red");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save(updated: Availability) {
    setSaving(true); setSaved(false); setError("");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/admin/login"); return; }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/config/level-availability`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ availability: updated }),
    });
    if (res.ok) { setAvailability(updated); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    else setError("Error guardando los cambios. Intenta de nuevo.");
    setSaving(false);
  }

  function handleToggle(plan: string, level: string) {
    const current = availability[plan]?.[level] !== false;
    const updated: Availability = {
      ...availability,
      [plan]: { ...(availability[plan] ?? {}), [level]: !current },
    };
    save(updated);
  }

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm">Cargando…</span>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Niveles por plan</h1>
          <p className="text-sm text-gray-400 mt-1">
            Activa o desactiva qué niveles se pueden comprar en cada plan. Los cambios se aplican
            de inmediato en el formulario de pago.
          </p>
        </div>
        {saving ? (
          <span className="shrink-0 text-xs font-medium text-gray-400">Guardando…</span>
        ) : saved ? (
          <span className="shrink-0 text-xs font-medium text-emerald-600">Guardado ✓</span>
        ) : null}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="space-y-5">
        {PLANS.map((plan) => (
          <div key={plan} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${PLAN_META[plan]?.chip ?? "bg-gray-100 text-gray-600"}`}>
                {PLAN_META[plan]?.label ?? plan}
              </span>
            </div>
            <ul className="divide-y divide-gray-50">
              {LEVELS.map((lvl) => {
                const enabled = availability[plan]?.[lvl.value] !== false;
                return (
                  <li key={lvl.value} className="flex items-center justify-between px-5 py-3.5 gap-4">
                    <p className="text-sm font-semibold text-gray-700">{lvl.label}</p>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleToggle(plan, lvl.value)}
                        disabled={saving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                          enabled ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          enabled ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                      <span className={`text-xs font-medium w-20 ${enabled ? "text-emerald-600" : "text-gray-400"}`}>
                        {enabled ? "Disponible" : "Desactivado"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
