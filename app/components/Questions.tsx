"use client";

import { useState } from "react";
import { Container } from "../components/Container";

const preguntasFrecuentes: { pregunta: string; respuesta: React.ReactNode }[] = [
  {
    pregunta: "¿Puedo cancelar en cualquier momento?",
    respuesta:
      "Sí, sin compromisos ni contratos. Puedes cancelar cuando quieras desde tu cuenta. No hay penalizaciones ni cargos ocultos.",
  },
  {
    pregunta: "¿Qué pasa si no soy constante con la rutina diaria?",
    respuesta:
      "El método está diseñado para que puedas retomarlo sin perder el hilo. Las 5 sesiones son flexibles: puedes hacerlas en distintos momentos del día. Si un día no puedes, simplemente continúas al día siguiente. La comunidad de WhatsApp y las clases de los viernes también te ayudan a mantenerte en ritmo.",
  },
  {
    pregunta: "¿Garantizan resultados en 90 días?",
    respuesta: (
      <>
        El Método 590 está diseñado para llevarte de cero a un nivel B1 conversacional en 90 días si sigues la rutina completa. Los resultados dependen de tu consistencia — quienes completan las 5 sesiones diarias ven progreso real desde las primeras semanas. Si tienes dudas sobre si es para ti, puedes escribirnos a{" "}
        <a href="mailto:info@lz-englishacademy.com" className="font-semibold text-falu-red-800 hover:text-falu-red-900 underline">
          info@lz-englishacademy.com
        </a>
        .
      </>
    ),
  },
  {
    pregunta: "¿Necesito experiencia previa en inglés?",
    respuesta:
      "No. El método empieza desde nivel A1 (principiante absoluto). También tenemos niveles A2, B1 y B2 para quienes ya tienen una base. Al inscribirte seleccionas tu nivel actual y el material se adapta a él.",
  },
  {
    pregunta: "¿Cuál es la diferencia entre Essential y Personalizado?",
    respuesta:
      "Con Essential accedes a la plataforma con todo el material organizado por sesiones, la comunidad de WhatsApp y las clases grupales en vivo los viernes — aprendes a tu propio ritmo. Con Personalizado tienes además clases 1:1 privadas con tu propio profesor, horario flexible y un plan de trabajo adaptado a tu nivel y objetivos desde el día 1.",
  },
  {
    pregunta: "¿Cuánto tiempo al día necesito dedicarle?",
    respuesta:
      "El método tiene 5 sesiones diarias que en total toman entre 2 y 3 horas. Pueden distribuirse durante el día — no tienen que hacerse seguidas. Con Essential tú decides cuándo; con Personalizado defines el horario con tu profesor.",
  },
  {
    pregunta: "¿Qué pasa si no puedo asistir a la clase del viernes?",
    respuesta:
      "No hay problema. Las clases de los viernes son en vivo por Zoom y tienen distintos horarios (mañana, tarde y noche). Si no puedes asistir una semana, el material sigue disponible en la plataforma y puedes retomar en la siguiente sesión.",
  },
  {
    pregunta: "¿Qué incluye la plataforma?",
    respuesta:
      "La plataforma organiza todo el material por sesión y nivel: teoría para la sesión 1, película o series con subtítulos en inglés para la sesión 2, flashcards de vocabulario en Quizlet para la sesión 3, lectura asignada para la sesión 4 y un tema de journaling + speaking challenge para la sesión 5. Todo está listo para que solo tengas que seguir la rutina.",
  },
  {
    pregunta: "¿Las 5 sesiones tienen que hacerse seguidas?",
    respuesta:
      "No. Puedes distribuirlas durante el día según tu horario — unas en la mañana, otras en la tarde y las últimas en la noche. Lo importante es completarlas todas dentro del día, en el orden indicado.",
  },
  {
    pregunta: "¿Cómo sé cuál es mi nivel de inglés?",
    respuesta: (
      <>
        Puedes hacer un test gratuito aquí:{" "}
        <a
          href="https://www.englishradar.com/english-test/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-falu-red-800 hover:text-falu-red-900 underline"
        >
          EnglishRadar – English Test
        </a>
        . Si aún tienes dudas, elige el nivel más cercano al tuyo — podemos ajustarlo después de que empieces.
      </>
    ),
  },
];

export default function PreguntasFrecuentes() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-14 sm:py-20 bg-white" id="faq">
      <Container>

        {/* Encabezado */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-falu-red-600 mb-2">
            FAQ
          </p>
          <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-3 text-sm text-zinc-500 max-w-md mx-auto">
            Todo lo que necesitas saber antes de empezar. ¿No encuentras tu respuesta?
            {" "}
            <a href="/#faq" className="font-semibold text-falu-red-800 hover:text-falu-red-900">
              Escríbenos →
            </a>
          </p>
        </div>

        {/* Accordion en dos columnas en desktop */}
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white overflow-hidden">
            {preguntasFrecuentes.map((item, i) => {
              const isOpen = openIndex === i;
              const isLast = i === preguntasFrecuentes.length - 1;

              return (
                <div key={i} className={`group ${isLast ? "" : ""}`}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-zinc-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-falu-red-800" : "text-zinc-800"}`}>
                      {item.pregunta}
                    </span>

                    {/* Ícono animado */}
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-falu-red-700 text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"}`}>
                      <svg
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 1v12M1 7h12"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {/* Respuesta con transición */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}
                  >
                    <div className="px-6 pb-5 border-t border-zinc-100">
                      <p className="pt-4 text-sm text-zinc-600 leading-relaxed">
                        {item.respuesta}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA inferior */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              ¿Tienes otra pregunta?{" "}
              <a
                href="mailto:info@lz-englishacademy.com"
                className="font-semibold text-falu-red-800 hover:text-falu-red-900 transition-colors"
              >
                Escríbenos directamente →
              </a>
            </p>
          </div>
        </div>

      </Container>
    </section>
  );
}