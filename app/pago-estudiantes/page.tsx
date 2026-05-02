"use client";

import { useEffect, useState } from "react";

interface StudentData {
  full_name: string;
  plan: string;
  level: string;
  inscription_date: string | null;
  country: string;
}

interface SpecialDate {
  value: string;
  label: string;
  special: boolean;
}

const MONTH_NAMES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDate(value: string | null): string {
  if (!value) return "No registrada";
  const [year, month, day] = value.split("-");
  return `${parseInt(day, 10)} de ${MONTH_NAMES_ES[parseInt(month, 10) - 1]} de ${year}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const selectClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300 appearance-none cursor-pointer";

const PLAN_PRICES: Record<string, string> = {
  Essential: "$10/mes",
  Premium: "$50/mes",
  Personalizado: "$100/mes",
};

export default function PagoEstudiantesPage() {
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [verifyError, setVerifyError] = useState("");

  const [plan, setPlan] = useState("Essential");
  const [level, setLevel] = useState("");
  const [interestDate, setInterestDate] = useState("");
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!student) return;
    fetch(`${BACKEND_URL}/config/special-dates`)
      .then((r) => r.json())
      .then((data) => setSpecialDates(Array.isArray(data) ? data : []))
      .catch(() => setSpecialDates([]));
  }, [student]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || verifying) return;
    setVerifying(true);
    setVerifyError("");
    try {
      const res = await fetch(`${BACKEND_URL}/verify-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.found) {
        setVerifyError("No encontramos ninguna cuenta con ese correo. Esta ruta es exclusiva para estudiantes actuales.");
        return;
      }
      setStudent(data.user);
      setPlan(data.user.plan || "Essential");
      setLevel(data.user.level || "");
    } catch {
      setVerifyError("Error al verificar. Intenta nuevamente.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!level) { setFormError("Selecciona tu nivel de inglés."); return; }
    if (!interestDate) { setFormError("Selecciona una fecha de inicio."); return; }
    setCheckoutLoading(true);
    setFormError("");
    try {
      const res = await fetch(`${BACKEND_URL}/student-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), plan, level, interestDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error");
      window.location.href = data.url;
    } catch {
      setFormError("No pudimos iniciar tu pago. Intenta nuevamente.");
      setCheckoutLoading(false);
    }
  }

  // ─── Step 1: Email input ───────────────────────────────────────────────────
  if (!student) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800 mb-5 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900">Área de estudiantes</h1>
            <p className="mt-2 text-sm text-zinc-500 max-w-xs mx-auto">
              Esta ruta es exclusiva para estudiantes actuales de LZ English Academy.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden">
            <div className="h-1.5 w-full bg-linear-to-r from-falu-red-700 via-falu-red-500 to-yellow-orange-400" />
            <form onSubmit={handleVerify} className="p-6 sm:p-8 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setVerifyError(""); }}
                  placeholder="tu@correo.com"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300"
                  required
                  autoComplete="email"
                />
              </div>

              {verifyError && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm text-red-600">{verifyError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={verifying || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-900 active:bg-zinc-950 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {verifying ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    Verificar acceso
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // ─── Step 2: Student card + plan selection ─────────────────────────────────
  const availableLevels = [
    { value: "Principiante", label: "Principiante (A1)" },
    { value: "Basico", label: "Básico (A2)" },
    { value: "Intermedio", label: "Intermedio (B1)" },
    ...(plan !== "Personalizado"
      ? [{ value: "Intermedio alto-gramatica", label: "Intermedio alto (B2.1)" }]
      : []),
    ...(plan === "Essential"
      ? [{ value: "Intermedio alto-produccion", label: "Intermedio alto (B2.2)" }]
      : []),
  ];

  const today = new Date().toISOString().split("T")[0];
  const futureDates = specialDates.filter((d) => d.value >= today);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-lg mx-auto space-y-4">

        {/* Student identity card */}
        <div className="rounded-2xl bg-zinc-800 shadow-md overflow-hidden">
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-zinc-600 flex items-center justify-center text-white font-bold text-lg select-none">
              {getInitials(student.full_name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-bold text-base truncate">{student.full_name}</p>
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Verificado
                </span>
              </div>
              <p className="text-zinc-400 text-xs truncate">{email}</p>
            </div>
          </div>

          <div className="border-t border-zinc-700 px-6 py-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">Plan actual</p>
              <p className="text-sm font-semibold text-zinc-200">{student.plan || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">Nivel</p>
              <p className="text-sm font-semibold text-zinc-200">{student.level || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">Último inicio</p>
              <p className="text-sm font-semibold text-zinc-200">{formatDate(student.inscription_date)}</p>
            </div>
          </div>
        </div>

        {/* Selection form */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden">
          <div className="h-1.5 w-full bg-linear-to-r from-falu-red-700 via-falu-red-500 to-yellow-orange-400" />

          <form onSubmit={handleCheckout} className="p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-base font-bold text-zinc-900">Nuevo ciclo de inscripción</p>
              <p className="text-sm text-zinc-500 mt-0.5">Selecciona tu plan, nivel y fecha para este ciclo.</p>
            </div>

            {/* Plan */}
            <div>
              <label htmlFor="plan" className="block text-sm font-semibold text-zinc-700 mb-1.5">Plan</label>
              <div className="relative">
                <select
                  id="plan"
                  value={plan}
                  onChange={(e) => {
                    setPlan(e.target.value);
                    if (e.target.value === "Personalizado" &&
                      (level === "Intermedio alto-gramatica" || level === "Intermedio alto-produccion")) {
                      setLevel("");
                    }
                    setFormError("");
                  }}
                  className={selectClass}
                >
                  <option value="Essential">Essential — $10/mes</option>
                  <option value="Premium">Premium — $50/mes</option>
                  <option value="Personalizado">Personalizado — $100/mes</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-semibold text-zinc-700 mb-1.5">Nivel de inglés</label>
              <div className="relative">
                <select
                  id="level"
                  value={level}
                  onChange={(e) => { setLevel(e.target.value); setFormError(""); }}
                  className={selectClass}
                  required
                >
                  <option value="">Selecciona tu nivel</option>
                  {availableLevels.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Special dates */}
            <div>
              <label htmlFor="interestDate" className="block text-sm font-semibold text-zinc-700 mb-1.5">Fecha de inicio</label>
              {futureDates.length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
                  <svg className="h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  No hay fechas especiales disponibles en este momento. Contacta a tu instructora.
                </div>
              ) : (
                <div className="relative">
                  <select
                    id="interestDate"
                    value={interestDate}
                    onChange={(e) => { setInterestDate(e.target.value); setFormError(""); }}
                    className={selectClass}
                    required
                  >
                    <option value="">Selecciona una fecha</option>
                    {futureDates.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {formError && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            <div className="border-t border-zinc-100 pt-2" />

            <button
              type="submit"
              disabled={checkoutLoading || futureDates.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {checkoutLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  Ir al pago seguro — {PLAN_PRICES[plan] ?? ""}
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 16 16" fill="none">
                  <path d="M13 4L6.5 11 3 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Pago seguro vía Stripe
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 16 16" fill="none">
                  <path d="M13 4L6.5 11 3 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Confirmación enviada por correo
              </span>
            </div>
          </form>
        </div>

        <button
          onClick={() => { setStudent(null); setEmail(""); setVerifyError(""); }}
          className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition py-2"
        >
          ← Usar otro correo
        </button>
      </div>
    </main>
  );
}
