"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const levels = [
  { code: "A1", name: "Principiante", desc: "Solo entiendo y uso frases muy básicas" },
  { code: "A2", name: "Básico", desc: "Puedo comunicarme en situaciones simples" },
  { code: "B1", name: "Intermedio", desc: "Me desenvuelvo en conversaciones cotidianas" },
  { code: "B2", name: "Intermedio alto (inicial)", desc: "Expreso ideas con bastante claridad" },
  { code: "B2+", name: "Intermedio alto (avanzado)", desc: "Me comunico con fluidez y precisión" },
  { code: "?", name: "No estoy seguro/a", desc: "Necesito descubrirlo primero" },
];

export default function PasoUnoPage() {
  console.log("pasouno cargado");
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  function handleContinue() {
    if (!selected) return;
    router.push(`/pasodos?nivel=${encodeURIComponent(selected)}`);
  }

  return (
    <main
      className="relative min-h-[calc(100vh-68px)] overflow-hidden"
      style={{ backgroundColor: "#fadadd" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #9c181d 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] items-end gap-0">

          {/* Columna izquierda: imagen */}
          <div className="flex items-end justify-center h-full order-2 lg:order-1 -mt-32 lg:mt-0">
            <div className="relative w-[520px] h-full min-h-[calc(100vh-68px)] select-none overflow-hidden">
              <Image
                src="/muñecapaso1.svg"
                alt="Personaje guía"
                fill
                className="object-cover object-bottom scale-90 origin-bottom"
                priority
              />
            </div>
          </div>

          {/* Columna derecha: pregunta + opciones */}
          <div className="flex flex-col items-center justify-center py-6 lg:py-12 order-1 lg:order-2">

            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-800 tracking-tight">
                ¿Cuál es tu{" "}
                <span style={{ color: "#C0353E" }}>nivel de Inglés</span>?
              </h1>
              <p className="mt-2 text-[15px] text-zinc-500 font-medium">
                Selecciona el nivel con el que más te identificas
              </p>
            </div>

            <ul className="w-full max-w-[580px] flex flex-col gap-3">
              {levels.map((lvl) => {
                const isSelected = selected === lvl.code;
                return (
                  <li key={lvl.code}>
                    <button
                      type="button"
                      onClick={() => setSelected(lvl.code)}
                      className={[
                        "w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-150 bg-white shadow-sm ring-1",
                        isSelected
                          ? "ring-[#C0353E] shadow-md"
                          : "ring-zinc-200 hover:ring-[#e8adb0] hover:shadow-md",
                      ].join(" ")}
                    >
                      <span className={[
                        "shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl text-[13px] font-extrabold transition-colors",
                        isSelected ? "bg-[#C0353E] text-white" : "bg-[#fadadd] text-[#C0353E]",
                      ].join(" ")}>
                        {lvl.code}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-extrabold text-zinc-800 leading-tight">{lvl.name}</p>
                        <p className="text-[13px] text-zinc-400 mt-0.5 font-medium">{lvl.desc}</p>
                      </div>

                      <span className={["shrink-0 text-xl font-bold transition-colors", isSelected ? "text-[#C0353E]" : "text-zinc-300"].join(" ")}>
                        ›
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className={[
              "mt-8 transition-all duration-300",
              selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
            ].join(" ")}>
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center gap-3 rounded-2xl px-10 py-4 text-[15px] font-extrabold text-white shadow-lg transition hover:opacity-90 active:scale-95"
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