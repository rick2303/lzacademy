"use client";

import { useState } from "react";
import { Container } from "../components/Container";

const preguntasFrecuentes: { pregunta: string; respuesta: React.ReactNode }[] = [
  {
    pregunta: "¿Cómo puedo saber mi nivel de inglés?",
    respuesta: (
      <>
        Puedes hacer un test de nivel en línea para tener una idea aproximada de tu nivel actual.
        Te recomiendo este:
        {" "}
        <a
          href="https://www.englishradar.com/english-test/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-falu-red-800 hover:text-falu-red-900 underline"
        >
          EnglishRadar – English Test
        </a>
        .
        <br />
        <br />
        También puedes revisar los descriptores del MCER (Marco Común Europeo de Referencia para las Lenguas)
        para ver cuál se ajusta mejor a tus habilidades. En caso de duda, puedes elegir el nivel que creas
        que se acerca más a tu nivel actual y ajustarlo después si es necesario.
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
      "La plataforma te da el material de aprendizaje para la sesión 1, una película o shows para la sesión 2, un set de vocabulario en flashcards de quizlet para la sesión 3, un libro y páginas asignadas diarias para la sesión 4, una recomendación de tema para escribir en el journaling de la sesión 5 y un speaking challenge que envías al grupo de whatsapp.",
  },
  {
    pregunta: "¿Qué pasa si no puedo asistir a las reuniones de los viernes?",
    respuesta:
      "No te preocupes, las reuniones de los viernes son para resolver dudas y practicar, pero el material de aprendizaje está disponible en la plataforma para que puedas seguirlo a tu ritmo. Si no puedes asistir a una reunión, puedes revisar el material asignado para esa semana y unirte a la siguiente reunión para resolver cualquier duda que tengas.",
  },
];

export default function PreguntasFrecuentes() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-zinc-50">
      <Container>
        <h2 className="text-3xl font-extrabold text-center text-zinc-900">
          Preguntas Frecuentes
        </h2>

        <div className="mt-8 space-y-6">
          {preguntasFrecuentes.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-xl"
              onClick={() => toggleAnswer(index)}
            >
              <div className="flex justify-between items-center cursor-pointer">
                <p className="text-lg font-semibold text-zinc-900">
                  {item.pregunta}
                </p>
                <span
                  className={`text-sm font-semibold text-zinc-500 transition-transform transform ${openIndex === index ? "rotate-45" : ""
                    }`}
                >
                  +
                </span>
              </div>

              <div
                className={`mt-2 text-sm text-zinc-600 transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-screen" : "max-h-0 overflow-hidden"
                  }`}
              >
                {item.respuesta}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
