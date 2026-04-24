"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { id: "hablarlo",   label: "Hablarlo",              emoji: "🎙️" },
  { id: "gramatica",  label: "Gramática",              emoji: "📚" },
  { id: "escuchar",   label: "Entender al escucharlo", emoji: "📢" },
  { id: "confianza",  label: "Confianza al hablar",    emoji: "💬" },
];

function PasosDosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel") ?? "";

  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleContinuar() {
    if (!selected.length) return;
    router.push(
      `/pasotres?nivel=${encodeURIComponent(nivel)}&dificultades=${encodeURIComponent(selected.join(","))}`
    );
  }

  function handleVolver() {
    router.back();
  }

  return (
    <main
      className="relative min-h-[calc(100vh-68px)] overflow-hidden"
      style={{ backgroundColor: "#fadadd" }}
    >
      {/* Textura de puntos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #9c181d 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] items-end gap-0">

          {/* ── Columna izquierda: muñecapaso2 ── */}
          <div className="flex items-end justify-center h-full order-2 lg:order-1 mt-4 lg:mt-0">
            <div className="relative w-[300px] h-[360px] sm:w-[420px] sm:h-[480px] lg:w-[520px] lg:h-full lg:min-h-[calc(100vh-68px)] select-none overflow-hidden">
              <Image
                src="/muñecapaso2.svg"
                alt="Personaje guía paso 2"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>

          {/* ── Columna derecha: pregunta + opciones ── */}
          <div className="flex flex-col items-center justify-center py-6 lg:py-12 order-1 lg:order-2">

            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-800 tracking-tight">
                ¿Qué se te{" "}
                <span style={{ color: "#C0353E" }}>dificulta</span>{" "}
                más?
              </h1>
              <p className="mt-2 text-[15px] text-zinc-500 font-medium">
                Puedes seleccionar más de una opción
              </p>
            </div>

            {/* Opciones multi-select */}
            <ul className="w-full max-w-[580px] flex flex-col gap-3">
              {options.map((opt) => {
                const isSelected = selected.includes(opt.id);
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => toggle(opt.id)}
                      className={[
                        "w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-150 bg-white shadow-sm ring-1",
                        isSelected
                          ? "ring-[#C0353E] shadow-md"
                          : "ring-zinc-200 hover:ring-[#e8adb0] hover:shadow-md",
                      ].join(" ")}
                    >
                      {/* Emoji */}
                      <span className="shrink-0 text-2xl w-10 text-center">
                        {opt.emoji}
                      </span>

                      {/* Label */}
                      <span className="flex-1 text-[16px] font-extrabold text-zinc-800">
                        {opt.label}
                      </span>

                      {/* Checkbox */}
                      <span
                        className={[
                          "shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-[#C0353E]"
                            : "border-2 border-zinc-300 bg-white",
                        ].join(" ")}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3" viewBox="0 0 10 10" fill="none">
                            <polyline
                              points="1.5,5 4,7.5 8.5,2"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Botones */}
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={handleVolver}
                className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-bold text-zinc-600 bg-white shadow-sm transition hover:shadow-md active:scale-95"
                style={{ border: "1.5px solid #d4d4d4" }}
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleContinuar}
                disabled={selected.length === 0}
                className={[
                  "inline-flex items-center gap-3 rounded-2xl px-10 py-4 text-[15px] font-extrabold text-white shadow-lg transition active:scale-95",
                  selected.length > 0
                    ? "hover:opacity-90"
                    : "opacity-40 cursor-not-allowed",
                ].join(" ")}
                style={{ backgroundColor: "#bd181e" }}
              >
                Continuar
                <span className="text-xl leading-none">›</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default function PasosDosPage() {
  return (
    <Suspense fallback={null}>
      <PasosDosContent />
    </Suspense>
  );
}