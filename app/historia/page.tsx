import Image from "next/image";
import Link from "next/link";
import { Container } from "../components/Container";
import Card from "../components/Card";
import Pill from "../components/Pill";
import SEO from "../components/SEO";

const mentora = {
    name: "Loren Laínez",
    role: "Fundadora del Método 590",
    location: "Estados Unidos",
    photo: "/creadora.jpg",
    socials: [
        {
            platform: "Instagram" as const,
            handle: "@lz_academym590",
            href: "https://instagram.com/lz_academym590",
        },
        {
            platform: "TikTok" as const,
            handle: "@lore_lainez21",
            href: "https://tiktok.com/lore_lainez21",
        },
    ],
};


function PrimaryCTA({ children }: { children: React.ReactNode }) {
    return (
        <a
            href="/#planes"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition shadow-sm"
        >
            {children}
        </a>
    );
}

function SecondaryLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
        >
            {children}
        </Link>
    );
}

/* =========================
   ICONS (sin librerías)
   ========================= */

function InstagramIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
            <path
                d="M7.5 2.75h9A4.75 4.75 0 0 1 21.25 7.5v9A4.75 4.75 0 0 1 16.5 21.25h-9A4.75 4.75 0 0 1 2.75 16.5v-9A4.75 4.75 0 0 1 7.5 2.75Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M17.35 6.85h.01"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function TikTokIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                d="M14 3v10.1a4.6 4.6 0 1 1-3-4.3V6.2c1.2 1.5 2.9 2.6 5 2.8V7.3c-1-.2-2-.8-2.7-1.7A4.7 4.7 0 0 1 14 3Z"
                fill="currentColor"
                opacity="0.25"
            />
            <path
                d="M14.6 3v10.2a4.9 4.9 0 1 1-3.4-4.7V12a2.5 2.5 0 1 0 1.7 2.4V3h1.7Zm0 0c1.1 2 2.7 3.3 4.7 3.6v1.8c-1.8-.2-3.4-1-4.7-2.2V3Z"
                fill="currentColor"
            />
        </svg>
    );
}

type Platform = "Instagram" | "TikTok";
function platformIcon(platform: Platform) {
    const cls = "h-5 w-5";
    if (platform === "Instagram") return <InstagramIcon className={cls} />;
    return <TikTokIcon className={cls} />;
}

function SocialButton({
    platform,
    handle,
    href,
}: {
    platform: Platform;
    handle: string;
    href: string;
}) {
    const accent =
        platform === "Instagram"
            ? "text-falu-red-800"
            : "text-yellow-orange-800";

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={[
                "group flex items-center justify-between gap-3 rounded-xl px-4 py-3",
                "bg-white/70 ring-1 ring-inset ring-zinc-200 hover:bg-white transition",
            ].join(" ")}
        >
            <div className="flex items-center gap-3 min-w-0">
                <span
                    className={[
                        "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                        "bg-zinc-50 ring-1 ring-inset ring-zinc-200",
                        accent,
                    ].join(" ")}
                >
                    {platformIcon(platform)}
                </span>

                <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-600">{platform}</p>
                    <p className="truncate text-sm font-semibold text-zinc-900">{handle}</p>
                </div>
            </div>

            <span className="text-sm font-semibold text-falu-red-700 group-hover:text-falu-red-800">
                Ver →
            </span>
        </a>
    );
}

export default function HistoriaPage() {
    return (
        <>
            <SEO
                title="La historia de Loren Laínez | Método 590"
                description="Conoce a Loren Laínez, fundadora del Método 590. Descubre su historia real de aprendizaje intensivo de inglés en 3 meses y cómo creó un método efectivo y estructurado."
                url="https://lz-englishacademy.com/historia"
                image="/images/creadora.png"
            />
            <main className="bg-white text-zinc-900">
                {/* HERO */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-b from-falu-red-100 via-white to-falu-red-50" />
                    <div className="pointer-events-none absolute -top-28 left-10 h-72 w-72 rounded-full bg-falu-red-300/18 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-yellow-orange-300/14 blur-3xl" />

                    <Container>
                        <div className="relative py-12 sm:py-16">
                            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
                                {/* Perfil */}
                                <div className="lg:col-span-5">
                                    <Card className="overflow-hidden">
                                        <div className="relative h-28 bg-linear-to-r from-falu-red-800 to-yellow-orange-500">
                                            <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
                                            <div className="pointer-events-none absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-black/10 blur-2xl" />
                                        </div>

                                        <div className="relative -mt-12 px-6 pb-7 sm:px-8 sm:pb-8">
                                            <div className="flex items-end gap-4">
                                                <div className="relative h-28 w-28 overflow-hidden rounded-3xl ring-4 ring-white shadow-sm">
                                                    <Image
                                                        src={mentora.photo}
                                                        alt={mentora.name}
                                                        fill
                                                        sizes="112px"
                                                        className="object-cover"
                                                        priority
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xl font-extrabold text-zinc-900">
                                                        {mentora.name}
                                                    </p>
                                                    <p className="text-sm font-semibold text-zinc-700">
                                                        {mentora.role}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">{mentora.location}</p>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex flex-wrap gap-2">
                                                <Pill tone="falu">Historia real</Pill>
                                                <Pill tone="orange">3 meses</Pill>
                                                <Pill tone="neutral">Proceso + rutina</Pill>
                                            </div>

                                            <div className="mt-5 grid grid-cols-1 gap-3">
                                                {mentora.socials.map((s) => (
                                                    <SocialButton
                                                        key={s.platform}
                                                        platform={s.platform}
                                                        handle={s.handle}
                                                        href={s.href}
                                                    />
                                                ))}
                                            </div>

                                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                                <PrimaryCTA>Comenzar mi proceso</PrimaryCTA>
                                                <SecondaryLink href="/metodo">Ver el método</SecondaryLink>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Encabezado historia */}
                                <div className="lg:col-span-7">
                                    <Pill tone="falu">La historia detrás del Método 590</Pill>

                                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                                        Una necesidad real.{" "}
                                        <span className="text-falu-red-800">Un camino que parecía imposible.</span>
                                    </h1>

                                    <p className="mt-5 max-w-3xl text-base text-zinc-600 sm:text-lg">
                                        Soy Loren Laínez, creadora del Método 590. Actualmente estudio Ingeniería
                                        Biomédica y Computer Science en Estados Unidos. Este método nació de una
                                        necesidad profunda: aprender inglés para poder venir a estudiar aquí y abrir
                                        un camino que, en ese momento, parecía imposible.
                                    </p>

                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                        <SecondaryLink href="/como-funciona">Cómo funcionan las clases →</SecondaryLink>
                                        <SecondaryLink href="/sesiones">Ver sesiones →</SecondaryLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* CUERPO NARRATIVO */}
                <section className="py-12 sm:py-16">
                    <Container>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                            <div className="lg:col-span-7 space-y-6">
                                <Card className="p-6">
                                    <Pill tone="neutral">2021</Pill>
                                    <h2 className="mt-4 text-xl font-extrabold text-zinc-900">
                                        El requisito que no leí… y el problema real
                                    </h2>

                                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-700">
                                        <p>
                                            En 2021 yo estaba en el proceso para venir a estudiar a Estados Unidos.
                                            Mi primer año sería para aprender inglés ya dentro del país, pero antes
                                            debía cumplir varios requisitos. Tenía siete meses para hacerlo todo.
                                        </p>
                                        <p>
                                            Por descuido, nunca leí que uno de esos requisitos era pasar una entrevista…
                                            en inglés.
                                        </p>

                                        <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-inset ring-zinc-200">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                                Un mensaje que lo cambió todo
                                            </p>
                                            <p className="mt-3">
                                                <span className="font-semibold text-zinc-900">—</span> El último paso es la entrevista. Avísame cuando estés lista.
                                            </p>
                                            <p className="mt-2">
                                                En mi inocencia, respondí: <span className="font-semibold text-zinc-900">Ya estoy lista.</span>
                                            </p>
                                            <p className="mt-2">
                                                Entonces me dijo la verdad: la entrevista era completamente en inglés,
                                                y necesitaba un nivel conversacional (B1).
                                            </p>
                                        </div>

                                        <p>
                                            Ese era el problema. Yo no sabía ni el verbo <span className="font-semibold">to be</span>.
                                        </p>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <Pill tone="orange">El límite</Pill>
                                    <h3 className="mt-4 text-xl font-extrabold text-zinc-900">
                                        Tenía tres meses
                                    </h3>

                                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-700">
                                        <p>
                                            Había estado en academias antes, pero el método tradicional siempre me pareció
                                            aburrido. Nunca desarrollé un gusto por aprender inglés; al contrario,
                                            eso hizo que no quisiera aprenderlo.
                                        </p>
                                        <p>
                                            Pero esta vez no era una opción. Si no pasaba esa entrevista, no venía a Estados Unidos.
                                            Tenía tres meses.
                                        </p>

                                        <div className="rounded-2xl bg-yellow-orange-50/60 p-4 ring-1 ring-inset ring-yellow-orange-200">
                                            <p className="text-sm font-semibold text-yellow-orange-900">
                                                Contacté academias. Todas me dijeron lo mismo:
                                            </p>
                                            <p className="mt-2 text-sm text-zinc-700">
                                                “Es imposible. Eso lo logras en mínimo 6–8 meses.”
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <Pill tone="falu">El giro</Pill>
                                    <h3 className="mt-4 text-xl font-extrabold text-zinc-900">
                                        Fui a consultar a mi amiga de confianza: la ciencia
                                    </h3>

                                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-700">
                                        <p>
                                            Sin dejar que eso me desanimara, y recordando que me encanta el proceso científico,
                                            fui a consultar a mi amiga de confianza: la ciencia.
                                        </p>

                                        <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-inset ring-falu-red-200/60">
                                            <p className="text-sm font-semibold text-falu-red-900">
                                                ¿Qué dice la ciencia sobre aprender idiomas rápido?
                                            </p>
                                            <p className="mt-2">
                                                Hasta ese momento, no encontré una respuesta directa.
                                            </p>
                                            <p className="mt-3 text-sm font-semibold text-zinc-900">
                                                ¿Pero sabes qué sí dice la ciencia?
                                            </p>
                                            <p className="mt-2">
                                                Habla del proceso real: cómo el ser humano adquiere su idioma nativo.
                                                Cómo un bebé desarrolla lenguaje. Cómo aprende a hablar.
                                            </p>
                                        </div>

                                        <p className="font-semibold text-zinc-900">
                                            Y ahí supe exactamente qué hacer: imitar la forma en la que adquirimos nuestro idioma nativo.
                                        </p>
                                    </div>
                                </Card>
                            </div>

                            {/* LADO DERECHO: “Descubrimiento” sin entrar a sesiones */}
                            <div className="lg:col-span-5 space-y-6">
                                <Card className="relative overflow-hidden p-6 bg-falu-red-50/40">
                                    <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-falu-red-300/12 blur-3xl" />
                                    <div className="pointer-events-none absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-yellow-orange-300/10 blur-3xl" />

                                    <div className="relative">
                                        <Pill tone="neutral">El descubrimiento</Pill>
                                        <h3 className="mt-4 text-xl font-extrabold text-zinc-900">
                                            Así nace el lenguaje (en simple)
                                        </h3>

                                        <div className="mt-4 space-y-3 text-sm text-zinc-700">
                                            {[
                                                "Primero escuchamos: el cerebro se familiariza con sonidos y patrones.",
                                                "Observamos: gestos, labios, expresiones; conectamos emoción con significado.",
                                                "Imitamos: nacen sonidos, luego palabras, luego vocabulario.",
                                                "Nos equivocamos: no por falta de capacidad, sino por falta de estructura.",
                                                "La estructura se consolida con lectura y escritura.",
                                            ].map((t) => (
                                                <div
                                                    key={t}
                                                    className="flex items-start gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-inset ring-zinc-200/70"
                                                >
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />
                                                    <p>{t}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="mt-5 text-sm leading-relaxed text-zinc-700">
                                            Un adulto ya habla, ya lee y ya escribe. Entonces, recorrer ese mismo camino
                                            para adquirir una segunda lengua se vuelve más fácil si lo hacemos con intención
                                            y lo volvemos parte de la rutina.
                                        </p>

                                        <div className="mt-6 rounded-2xl bg-white/85 p-4 ring-1 ring-inset ring-falu-red-200/60">
                                            <p className="text-sm font-semibold text-falu-red-900">
                                                Y ahí nació el Método 590.
                                            </p>
                                            <p className="mt-2 text-sm text-zinc-700">
                                                Si querés ver el método completo y cómo se aplica, lo tenés explicado en sus páginas.
                                            </p>
                                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                                <SecondaryLink href="/metodo">Conocer el método</SecondaryLink>
                                                <SecondaryLink href="/sesiones">Conocer las sesiones</SecondaryLink>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <Pill tone="orange">Cierre</Pill>
                                    <h3 className="mt-4 text-xl font-extrabold text-zinc-900">
                                        Cambié el rumbo de mi vida
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                                        En tres meses pasé de no saber ni el verbo <span className="font-semibold">to be</span>…
                                        a pasar mi entrevista en inglés.
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                                        Ese día no solo aprobé una entrevista. Cambié el rumbo de mi vida.
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                                        El Método 590 no es magia. Es proceso. Es una rutina diaria diseñada para ayudarte
                                        a salir del “no puedo” y convertir el inglés en algo real.
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <PrimaryCTA>Comenzar mi proceso</PrimaryCTA>
                                        <Link
                                            href="/"
                                            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:bg-white transition"
                                        >
                                            Volver al inicio
                                        </Link>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </Container>
                </section>
            </main>
        </>
    );
}
