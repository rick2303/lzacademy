"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const features = [
  "Sesiones privadas 1:1 adaptadas a ti",
  "Acceso completo al Método 590",
  "Horario 100% flexible",
  "Plan de trabajo personalizado desde el día 1",
  "Seguimiento y motivación constante",
  "Corrección en tiempo real",
  "Avanza exactamente a tu ritmo",
];

export default function PersonalizadoPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel") ?? "";

  function handleComenzar() {
    router.push(`/pasotres?nivel=${encodeURIComponent(nivel)}&plan=personalizado`);
  }

  function handleCambiarPlan() {
    router.back();
  }

  function handleMasInfo() {
    window.open("https://wa.me/xxxxxxx", "_blank");
  }

  return (
    <main
      className="relative min-h-[calc(100vh-68px)] overflow-hidden"
      style={{ backgroundColor: "#f06080" }}
    >
      {/* Textura de puntos sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #7a0a1a 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] items-end gap-0">

          {/* ── Columna izquierda: muñeca-personalizada ── */}
          <div className="flex items-end justify-center h-full order-2 lg:order-1 mt-4 lg:mt-0">
            <div className="relative w-[380px] h-[440px] sm:w-[420px] sm:h-[480px] lg:w-[520px] lg:h-full lg:min-h-[calc(100vh-68px)] select-none overflow-hidden">
              <Image
                src="/muñeca-personalizada.svg"
                alt="Muñeca Personalizada"
                fill
                className="object-contain object-bottom"
                priority
              />

            </div>
          </div>

          {/* ── Columna derecha: contenido del plan ── */}
          <div className="flex flex-col items-center justify-center py-6 lg:py-12 order-1 lg:order-2">

            {/* Título */}
            <div className="text-center mb-8 w-full">
              <h1
                className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
                style={{ textShadow: "0 2px 12px rgba(120,10,30,0.18)" }}
              >
                Tu plan seleccionado
              </h1>
            </div>

            {/* Card del plan */}
            <div
              className="w-full max-w-[680px] bg-white rounded-3xl shadow-sm"
              style={{ border: "2px solid rgba(255,255,255,0.7)" }}
            >
              <div className="flex flex-col sm:flex-row gap-0">

                {/* Left: nombre, precio, descripción */}
                <div className="flex flex-col justify-center px-8 py-8 sm:w-[260px] shrink-0">
                  <p className="text-3xl font-extrabold text-zinc-800 mb-1">
                    Personalizado
                  </p>

                  <div
                    className="flex items-baseline gap-1 mb-4"
                    style={{ color: "#C0353E" }}
                  >
                    <span className="text-5xl font-extrabold leading-none">$100</span>
                    <span className="text-sm font-bold"> USD/mes</span>
                  </div>

                  <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">
                    Para quienes quieren avanzar rápido con clases 1:1 adaptadas a
                    su horario y proceso.
                  </p>
                </div>

                {/* Divisor vertical */}
                <div
                  className="hidden sm:block w-px my-8 shrink-0"
                  style={{ backgroundColor: "#f0c8cc" }}
                />
                {/* Divisor horizontal (mobile) */}
                <div
                  className="block sm:hidden h-px mx-8"
                  style={{ backgroundColor: "#f0c8cc" }}
                />

                {/* Right: features */}
                <div className="flex flex-col justify-center px-8 py-8 flex-1">
                  <p
                    className="text-[11px] font-extrabold uppercase tracking-widest mb-4"
                    style={{ color: "#C0353E" }}
                  >
                    Incluye:
                  </p>

                  <ul className="flex flex-col gap-3">
                    {features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3">
                        <span
                          className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full"
                          style={{ border: "2px solid #C0353E" }}
                        >
                          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                            <polyline
                              points="1.5,5 4,7.5 8.5,2"
                              stroke="#C0353E"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="text-[13px] font-bold text-zinc-700">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p
                    className="mt-5 text-[11.5px] leading-relaxed italic"
                    style={{ color: "#C0353E" }}
                  >
                    Agendas tu primera sesión y definimos juntos el plan.
                  </p>
                </div>

              </div>
            </div>

            {/* Acciones */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleComenzar}
                className="inline-flex items-center gap-3 rounded-2xl px-10 py-4 text-[15px] font-extrabold text-white shadow-lg transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#bd181e" }}
              >
                Comenzar Ahora
                <span className="text-xl leading-none">›</span>
              </button>

              <button
                type="button"
                onClick={handleCambiarPlan}
                className="inline-flex items-center gap-3 rounded-2xl px-7 py-4 text-[14px] font-bold text-zinc-700 bg-white shadow-sm transition hover:shadow-md active:scale-95"
                style={{ border: "1.5px solid rgba(255,255,255,0.8)" }}
              >
                Cambiar plan
              </button>

              <button
                type="button"
                onClick={handleMasInfo}
                className="inline-flex items-center gap-3 rounded-2xl px-7 py-4 text-[14px] font-extrabold text-zinc-800 bg-white shadow-sm transition hover:shadow-md active:scale-95"
                style={{ border: "2px solid #fff" }}
              >
                Quiero Más Información
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}