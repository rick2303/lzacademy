import Link from "next/link";
import { Container } from "../components/Container";

const LAST_UPDATED = "21 de mayo de 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-zinc-600">
        {children}
      </div>
    </section>
  );
}

export default function ReembolsosPage() {
  return (
    <main className="bg-white text-zinc-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-falu-red-100 via-white to-falu-red-50" />
        <div className="pointer-events-none absolute -top-28 left-10 h-72 w-72 rounded-full bg-falu-red-300/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-yellow-orange-300/14 blur-3xl" />
        <Container>
          <div className="relative mx-auto max-w-3xl py-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-wide text-falu-red-700">
              LZ English Academy — Método 590
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Política de Reembolso y Cancelación
            </h1>
            <p className="mt-4 text-sm text-zinc-500">
              Última actualización: {LAST_UPDATED}
            </p>
          </div>
        </Container>
      </section>

      {/* CONTENIDO */}
      <section className="py-12 sm:py-16">
        <Container>
          <article className="mx-auto max-w-3xl">
            <div className="space-y-4 text-[15px] leading-relaxed text-zinc-600">
              <p>
                Esta Política de Reembolso y Cancelación describe en qué condiciones puedes
                solicitar la devolución de tu pago o cancelar tu suscripción a{" "}
                <strong>LZ English Academy</strong> y al <strong>Método 590</strong>. Forma
                parte integral de nuestros{" "}
                <Link
                  href="/terminos"
                  className="font-semibold text-falu-red-700 hover:text-falu-red-800"
                >
                  Términos y Condiciones
                </Link>
                .
              </p>
            </div>

            <Section title="1. Garantía de satisfacción para estudiantes nuevos">
              <p>
                Si es tu <strong>primera inscripción</strong>, tienes derecho a un{" "}
                <strong>reembolso completo</strong> si solicitas la cancelación:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>antes de que inicien tus clases, o</li>
                <li>
                  dentro de los primeros <strong>3 días</strong> posteriores al inicio de tu
                  cohorte.
                </li>
              </ul>
            </Section>

            <Section title="2. Después de los 3 días">
              <p>
                Una vez transcurridos los primeros 3 días desde el inicio de clases,{" "}
                <strong>no se otorgan reembolsos</strong> del periodo en curso. Puedes cancelar
                la renovación desde tu{" "}
                <Link
                  href="/mi-suscripcion"
                  className="font-semibold text-falu-red-700 hover:text-falu-red-800"
                >
                  portal de suscripción
                </Link>{" "}
                para no ser cobrado en el siguiente periodo, conservando el acceso hasta el final
                del periodo ya pagado.
              </p>
            </Section>

            <Section title="3. Renovaciones">
              <p>
                La garantía de reembolso aplica <strong>únicamente a la primera
                inscripción</strong>. Los periodos de <strong>renovación no son
                reembolsables</strong>; solo es posible cancelar la renovación futura.
              </p>
            </Section>

            <Section title="4. Planes de pago único">
              <p>
                Personalizado y Speaking Sessions se rigen por la misma garantía de 3 días desde
                el inicio del servicio contratado para compras nuevas; pasado ese plazo no son
                reembolsables.
              </p>
            </Section>

            <Section title="5. Cómo solicitar un reembolso">
              <p>
                Envía tu solicitud a{" "}
                <a
                  href="mailto:info@lz-englishacademy.com"
                  className="font-semibold text-falu-red-700 hover:text-falu-red-800"
                >
                  info@lz-englishacademy.com
                </a>{" "}
                indicando el correo de tu inscripción. Los reembolsos aprobados se procesan al
                método de pago original a través de Stripe y pueden tardar varios días hábiles en
                reflejarse, según tu banco.
              </p>
            </Section>

            <Section title="6. Efecto del reembolso">
              <p>
                Al otorgarse un reembolso, <strong>se cancela también tu suscripción</strong> y
                se retira tu acceso al Servicio, incluyendo la salida de la comunidad de WhatsApp.
              </p>
            </Section>

            <Section title="7. Excepciones">
              <p>
                No se otorgan reembolsos en casos de uso indebido del Servicio, incumplimiento de
                nuestros Términos y Condiciones, o conducta que vulnere las normas de convivencia
                de la comunidad.
              </p>
            </Section>

            <Section title="8. Contacto">
              <p>Para cualquier consulta sobre esta Política, escríbenos a:</p>
              <p>
                <a
                  href="mailto:info@lz-englishacademy.com"
                  className="font-semibold text-falu-red-700 hover:text-falu-red-800"
                >
                  info@lz-englishacademy.com
                </a>
                <br />
                LZ English Academy — Método 590
                <br />
                <span className="text-zinc-500">lz-englishacademy.com</span>
              </p>
            </Section>
          </article>
        </Container>
      </section>
    </main>
  );
}
