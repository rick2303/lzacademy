import Link from "next/link";
import { Container } from "../components/Container";

const LAST_UPDATED = "17 de junio de 2026";

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

export default function TerminosPage() {
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
              Términos y Condiciones de Uso
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
                Bienvenido(a) a <strong>LZ English Academy</strong> (&ldquo;la
                Academia&rdquo;, &ldquo;nosotros&rdquo;). Estos Términos y Condiciones
                (&ldquo;Términos&rdquo;) regulan el acceso y uso de nuestro sitio web{" "}
                <span className="font-medium text-zinc-700">lz-englishacademy.com</span> y de
                los programas de aprendizaje de inglés conocidos como el{" "}
                <strong>Método 590</strong> (&ldquo;el Servicio&rdquo;). Al inscribirte y
                realizar un pago, declaras que has leído, entendido y aceptado estos Términos
                en su totalidad.
              </p>
              <p>
                El Servicio es operado por <strong>LainZ590</strong>, con sede en{" "}
                <strong>San Francisco, California, Estados Unidos</strong>.
              </p>
            </div>

            <Section title="1. Definiciones">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Estudiante / Usuario:</strong> la persona que se inscribe y paga por
                  acceder al Servicio.
                </li>
                <li>
                  <strong>Plan:</strong> la modalidad de suscripción o pago contratada
                  (Essential, Premium, Personalizado o Speaking Sessions).
                </li>
                <li>
                  <strong>Cohorte:</strong> grupo de estudiantes cuyas clases inician en una
                  misma fecha de inicio. Las cohortes abren aproximadamente cada 4 semanas.
                </li>
                <li>
                  <strong>Periodo de facturación:</strong> intervalo de 4 semanas (28 días) que
                  cubre cada cobro de los planes de suscripción.
                </li>
              </ul>
            </Section>

            <Section title="2. Objeto del Servicio">
              <p>
                La Academia ofrece acceso a una plataforma de aprendizaje de inglés que puede
                incluir, según el Plan contratado: material organizado por sesiones, una
                comunidad en WhatsApp, clases grupales en vivo, clases privadas 1:1 y sesiones
                de práctica. El alcance específico de cada Plan se describe en la página de cada
                Plan al momento de la inscripción.
              </p>
            </Section>

            <Section title="3. Inscripción y cuenta">
              <p>
                3.1. Para inscribirte debes proporcionar información veraz y completa (nombre,
                correo electrónico, país y nivel de inglés, entre otros).
              </p>
              <p>
                3.2. Eres responsable de la confidencialidad de tus credenciales y de toda
                actividad realizada bajo tu cuenta.
              </p>
              <p>
                3.3. El acceso al Servicio (incluyendo la incorporación a la comunidad de
                WhatsApp y al material) se entrega de forma <strong>personal e
                intransferible</strong>. Está prohibido compartir, revender o ceder tu acceso a
                terceros.
              </p>
            </Section>

            <Section title="4. Planes, precios y modalidad de cobro">
              <p>
                4.1. <strong>Precios.</strong> Los precios vigentes se muestran en el sitio al
                momento de la inscripción, expresados en{" "}
                <strong>dólares estadounidenses (USD)</strong>. La Academia puede modificar los
                precios a futuro; los cambios no afectan periodos ya pagados.
              </p>
              <p>
                4.2. <strong>Planes de suscripción recurrente (Essential y Premium).</strong>{" "}
                Estos Planes funcionan como una{" "}
                <strong>suscripción que se renueva automáticamente cada 4 semanas (28
                días)</strong>. Al inscribirte realizas un primer pago que cubre tu primer periodo
                de clases (tu cohorte); a partir de la <strong>fecha de inicio de esa cohorte</strong>{" "}
                se realizan cobros automáticos cada 4 semanas con el método de pago registrado,
                hasta que el Estudiante cancele. Al contratar un Plan de suscripción,{" "}
                <strong>autorizas expresamente</strong> a la Academia, a través de Stripe, a cobrar
                de forma automática y recurrente el método de pago que registres conforme a esta
                modalidad.
              </p>
              <p>
                4.3. <strong>Planes de pago único (Personalizado y Speaking Sessions).</strong>{" "}
                Estos Planes se cobran <strong>una sola vez</strong> por periodo o sesión. No hay
                cobro automático ni renovación: si el Estudiante desea continuar, debe realizar
                un nuevo pago de forma manual.
              </p>
              <p>
                4.4. <strong>Procesamiento de pagos.</strong> Los pagos se procesan a través de{" "}
                <strong>Stripe</strong>. La Academia no almacena los datos completos de tu
                tarjeta. Al pagar, también aceptas los términos del procesador de pagos.
              </p>
            </Section>

            <Section title="5. Acceso, fechas de inicio y cohortes">
              <p>
                5.1. Las clases inician en <strong>fechas de cohorte</strong> que abren
                aproximadamente cada 4 semanas. Al inscribirte se te informa la fecha de inicio
                correspondiente.
              </p>
              <p>
                5.2. <strong>Acceso entre el pago y el inicio de clases.</strong> El cobro se
                realiza el día de la inscripción, que puede ser días antes del inicio de tu
                cohorte. Durante ese lapso recibirás acceso de bienvenida (por ejemplo,
                incorporación a la comunidad de WhatsApp y material introductorio). Aceptas que
                el cobro pueda ocurrir antes de la fecha de inicio de clases.
              </p>
              <p>
                5.3. <strong>Vigencia del acceso.</strong> Cada periodo pagado te da acceso
                hasta el siguiente inicio de clases correspondiente. La renovación automática (en
                planes de suscripción) extiende tu acceso al siguiente periodo.
              </p>
            </Section>

            <Section title="6. Renovación y cancelación">
              <p>
                6.1. <strong>Renovación automática.</strong> En los planes de suscripción
                (Essential y Premium), la suscripción se renueva automáticamente cada 4 semanas,
                salvo que la canceles antes de la fecha de renovación.
              </p>
              <p>
                6.2. <strong>Cómo cancelar.</strong> Puedes cancelar en cualquier momento desde tu{" "}
                <Link
                  href="/mi-suscripcion"
                  className="font-semibold text-falu-red-700 hover:text-falu-red-800"
                >
                  portal de gestión de suscripción
                </Link>
                : ingresa el correo de tu inscripción y recibirás por correo un enlace seguro para
                gestionar o cancelar tu suscripción. También puedes solicitar la cancelación
                escribiendo a{" "}
                <a
                  href="mailto:info@lz-englishacademy.com"
                  className="font-semibold text-falu-red-700 hover:text-falu-red-800"
                >
                  info@lz-englishacademy.com
                </a>
                . La cancelación detiene los cobros futuros.
              </p>
              <p>
                6.3. <strong>Efecto de la cancelación.</strong> Al cancelar,{" "}
                <strong>conservas el acceso hasta el final del periodo ya pagado</strong> (la
                cohorte vigente). No se generan cobros posteriores.
              </p>
              <p>
                6.4. Si cancelas antes de la fecha de renovación, no se te cobrará el siguiente
                periodo y conservarás el acceso hasta el final del periodo en curso.
              </p>
            </Section>

            <Section title="7. Política de Reembolso">
              <p>
                El detalle completo de reembolsos y cancelaciones se encuentra en nuestra{" "}
                <Link
                  href="/reembolsos"
                  className="font-semibold text-falu-red-700 hover:text-falu-red-800"
                >
                  Política de Reembolso y Cancelación
                </Link>
                , que forma parte integral de estos Términos. En resumen: los estudiantes nuevos
                disponen de una garantía de reembolso completo si cancelan antes de iniciar sus
                clases o dentro de los primeros 3 días naturales de su cohorte; las renovaciones y
                reinscripciones no son reembolsables.
              </p>
            </Section>

            <Section title="8. Conducta del usuario">
              <p>
                Te comprometes a no: (a) compartir o revender tu acceso; (b) reproducir,
                distribuir o comercializar el material del Método 590 sin autorización; (c)
                acosar o faltar el respeto a otros estudiantes o al personal en la comunidad; (d)
                usar el Servicio con fines ilícitos. El incumplimiento puede resultar en la
                suspensión o terminación de tu acceso sin reembolso.
              </p>
            </Section>

            <Section title="9. Propiedad intelectual">
              <p>
                Todo el contenido del Método 590 (materiales, videos, metodología, marca y
                diseños) es propiedad de la Academia o de sus licenciantes y está protegido por
                las leyes de propiedad intelectual aplicables. Tu inscripción te otorga una
                licencia <strong>personal, limitada, no exclusiva e intransferible</strong> para
                uso educativo propio, sin derecho a copiar ni redistribuir.
              </p>
            </Section>

            <Section title="10. Protección de datos personales">
              <p>
                La Academia recolecta y trata datos personales (nombre, correo, país, nivel y
                datos necesarios para el pago) con el fin de prestar el Servicio. Los pagos son
                procesados por Stripe conforme a su propia política de privacidad.
              </p>
            </Section>

            <Section title="11. Limitación de responsabilidad">
              <p>
                El Servicio se ofrece &ldquo;tal cual&rdquo;. La Academia no garantiza resultados
                específicos de aprendizaje, los cuales dependen del esfuerzo y dedicación de cada
                Estudiante. En la medida permitida por la ley, la responsabilidad de la Academia
                se limita al monto pagado por el Estudiante en el periodo vigente.
              </p>
            </Section>

            <Section title="12. Modificaciones a los Términos">
              <p>
                La Academia puede actualizar estos Términos en cualquier momento. Los cambios se
                publicarán en esta página con su fecha de actualización. El uso continuado del
                Servicio tras una modificación implica la aceptación de los nuevos Términos.
              </p>
            </Section>

            <Section title="13. Ley aplicable y resolución de disputas">
              <p>
                Estos Términos se rigen por las leyes del{" "}
                <strong>Estado de California, Estados Unidos</strong>. Cualquier controversia se
                someterá a los tribunales competentes de San Francisco, California, salvo
                disposición legal en contrario.
              </p>
            </Section>

            <Section title="14. Contacto">
              <p>Para cualquier consulta sobre estos Términos, escríbenos a:</p>
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
