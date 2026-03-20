"use client";

import { useState } from "react";
import { Container } from "../components/Container";

const preguntasFrecuentes: { pregunta: string; respuesta: React.ReactNode }[] = [
  {
    pregunta: "¿Cómo puedo contactar al equipo de LZ Academy?",
    respuesta: (
      <>
        Pues contactarte traves del correo: {" "} info@lz-englishacademy.com o al correo lzacademy590@gmail.com
      </>
    ),
  },
  {
    pregunta: "¿Cómo puedo saber mi nivel de inglés?",
    respuesta: (
      <>
        Puedes hacer un test de nivel en línea para tener una idea aproximada de tu nivel actual.
        Te recomiendo este:{" "}
        <a
          href="https://www.englishradar.com/english-test/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-falu-red-800 hover:text-falu-red-900 underline"
        >
          EnglishRadar – English Test
        </a>
        .<br /><br />
        También puedes revisar los descriptores del MCER (Marco Común Europeo de Referencia para
        las Lenguas) para ver cuál se ajusta mejor a tus habilidades. En caso de duda, puedes
        elegir el nivel que creas que se acerca más a tu nivel actual y ajustarlo después si es
        necesario.
      </>
    ),
  },
  {
    pregunta: "¿Se tienen que hacer las 5 sesiones juntas de una sola vez?",
    respuesta:
      "No necesariamente. Pueden hacerse en distintas partes del día, unas en la mañana, otras en la tarde, últimas en la noche.",
  },
  {
    pregunta: "¿Hay que seguir el orden de las sesiones?",
    respuesta: "Sí, están hechas con estrategia.",
  },
  {
    pregunta: "¿Cuánto dura cada nivel?",
    respuesta: "Cada nivel dura aproximadamente 1 mes.",
  },
  {
    pregunta: "¿Cómo son las sesiones de práctica de los viernes?",
    respuesta:
      "Las reuniones son por Zoom, hacemos repaso primero y luego les damos las indicaciones para conversar por 5 min en una salita privada con otra persona.",
  },
  {
    pregunta: "¿A qué hora son las reuniones los viernes?",
    respuesta: "Hay distintos horarios: horarios en la mañana, tarde y noche.",
  },
  {
    pregunta: "¿Qué incluye la plataforma?",
    respuesta:
      "La plataforma te da el material de aprendizaje para la sesión 1, una película o shows para la sesión 2, un set de vocabulario en flashcards de Quizlet para la sesión 3, un libro y páginas asignadas diarias para la sesión 4, una recomendación de tema para escribir en el journaling de la sesión 5 y un speaking challenge que envías al grupo de WhatsApp.",
  },
  {
    pregunta: "¿Qué pasa si no puedo asistir a las reuniones de los viernes?",
    respuesta:
      "No te preocupes, las reuniones de los viernes son para resolver dudas y practicar, pero el material de aprendizaje está disponible en la plataforma para que puedas seguirlo a tu ritmo. Si no puedes asistir a una reunión, puedes revisar el material asignado para esa semana y unirte a la siguiente reunión para resolver cualquier duda que tengas.",
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
                href="/#faq"
                className="font-semibold text-falu-red-800 hover:text-falu-red-900 transition-colors"
              >
                Contáctanos directamente →
              </a>
            </p>
          </div>
        </div>

      </Container>
    </section>
  );
}