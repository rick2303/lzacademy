import Image from "next/image";
import Link from "next/link";
import { Container } from "../components/Container";

const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSfV00z8jTW-0JL_znLT5yhsU9TmfVcvo3hxhgDXWiobA0nodQ/viewform";


const mentora = {
    name: "Loren Laínez",
    role: "Mentora",
    location: "San Francisco, CA",
    photo: "/mentora.jpeg",
    socials: [
        {
            platform: "Instagram" as const,
            handle: "@lz_academym590",
            href: "https://instagram.com/",
        },
        {
            platform: "TikTok" as const,
            handle: "@lore_lainez21",
            href: "https://tiktok.com/lore_lainez21",
        },

    ],
    quote:
        "Necesitaba aprender inglés en tres meses para superar una entrevista completamente en inglés. Los métodos tradicionales eran lentos, fragmentados y pasivos… así nació una estructura diaria que me obligaba a vivir el idioma, no solo estudiarlo.",
};

function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={[
                "rounded-2xl bg-white shadow-sm ring-1 ring-black/5",
                "transition hover:shadow-md hover:-translate-y-0.5",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

function Pill({
    children,
    tone = "falu",
}: {
    children: React.ReactNode;
    tone?: "falu" | "orange" | "neutral";
}) {
    const styles =
        tone === "orange"
            ? "bg-yellow-orange-50 text-yellow-orange-900 ring-yellow-orange-200"
            : tone === "falu"
                ? "bg-falu-red-50 text-falu-red-900 ring-falu-red-200"
                : "bg-zinc-50 text-zinc-700 ring-zinc-200";

    return (
        <span
            className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                styles,
            ].join(" ")}
        >
            {children}
        </span>
    );
}

function Badge({
    children,
    variant = "falu",
}: {
    children: React.ReactNode;
    variant?: "falu" | "orange" | "neutral";
}) {
    const styles =
        variant === "orange"
            ? "bg-yellow-orange-500 text-white"
            : variant === "falu"
                ? "bg-falu-red-700 text-white"
                : "bg-zinc-900 text-white";

    return (
        <span
            className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
                styles,
            ].join(" ")}
        >
            {children}
        </span>
    );
}

function PrimaryCTA({ children }: { children: React.ReactNode }) {
    return (
        <a
            href={FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-yellow-orange-500 hover:bg-yellow-orange-600 active:bg-yellow-orange-700 transition shadow-sm"
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
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
            fill="none"
        >
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
            {/* “sombra” tipo cian */}
            <path
                d="M14 3v10.1a4.6 4.6 0 1 1-3-4.3V6.2c1.2 1.5 2.9 2.6 5 2.8V7.3c-1-.2-2-.8-2.7-1.7A4.7 4.7 0 0 1 14 3Z"
                fill="currentColor"
                opacity="0.25"
            />
            {/* nota principal */}
            <path
                d="M14.6 3v10.2a4.9 4.9 0 1 1-3.4-4.7V12a2.5 2.5 0 1 0 1.7 2.4V3h1.7Zm0 0c1.1 2 2.7 3.3 4.7 3.6v1.8c-1.8-.2-3.4-1-4.7-2.2V3Z"
                fill="currentColor"
            />
        </svg>
    );
}


function YouTubeIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
            fill="none"
        >
            <path
                d="M21 12c0-2.2-.2-3.6-.6-4.4a3 3 0 0 0-1.7-1.6C17.5 5.5 12 5.5 12 5.5s-5.5 0-6.7.5A3 3 0 0 0 3.6 7.6C3.2 8.4 3 9.8 3 12s.2 3.6.6 4.4a3 3 0 0 0 1.7 1.6c1.2.5 6.7.5 6.7.5s5.5 0 6.7-.5a3 3 0 0 0 1.7-1.6c.4-.8.6-2.2.6-4.4Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M10.5 9.5 15.8 12l-5.3 2.5V9.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

function VerifiedIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
            fill="none"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M8.5 12.2l2.1 2.2 5-5.1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

type Platform = "Instagram" | "TikTok" | "YouTube";

function platformIcon(platform: Platform) {
    const cls = "h-5 w-5";
    if (platform === "Instagram") return <InstagramIcon className={cls} />;
    if (platform === "TikTok") return <TikTokIcon className={cls} />;
    return <YouTubeIcon className={cls} />;
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
            : platform === "TikTok"
                ? "text-yellow-orange-800"
                : "text-zinc-800";

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

export default function MentoraPage() {
    return (
        <main className="bg-white text-zinc-900">
            {/* HERO PERFIL */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-falu-red-50 via-white to-yellow-orange-50" />
                <div className="pointer-events-none absolute -top-28 left-10 h-72 w-72 rounded-full bg-falu-red-300/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-yellow-orange-300/20 blur-3xl" />

                <Container>
                    <div className="relative py-12 sm:py-16">
                        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-center">
                            {/* Perfil */}
                            <div className="lg:col-span-6">
                                <Card className="overflow-hidden">
                                    {/* Top gradient strip (más alto) */}
                                    <div className="relative h-32 bg-gradient-to-r from-falu-red-800 to-yellow-orange-500">
                                        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
                                        <div className="pointer-events-none absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-black/10 blur-2xl" />
                                    </div>

                                    {/* Contenido (más padding) */}
                                    <div className="relative -mt-14 px-6 pb-7 sm:px-8 sm:pb-8">
                                        {/* Fila superior: foto + placa de texto */}
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                            <div className="flex items-end gap-4">
                                                {/* Foto más grande */}
                                                <div className="relative h-30 w-30 overflow-hidden rounded-3xl ring-4 ring-white shadow-sm sm:h-38 sm:w-34">
                                                    <Image
                                                        src={mentora.photo}
                                                        alt={mentora.name}
                                                        fill
                                                        sizes="(max-width: 640px) 118px, 128px"
                                                        className="object-cover"
                                                        priority
                                                    />
                                                </div>

                                                {/* Placa blanca para legibilidad */}
                                                <div className="rounded-2xl bg-white/90 px-3 py-4 ring-1 ring-black/5 backdrop-blur sm:mb-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h1 className="text-xl font-extrabold text-zinc-900 sm:text-2xl">
                                                            {mentora.name}
                                                        </h1>

                                                        <Badge variant="falu">
                                                            <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-white/20">
                                                                <VerifiedIcon className="h-3 w-3" />
                                                            </span>
                                                            Verificada
                                                        </Badge>
                                                    </div>

                                                    <p className="mt-1 text-sm font-semibold text-zinc-700">{mentora.role}</p>
                                                    <p className="text-xs text-zinc-500">{mentora.location}</p>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Pills */}
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <Pill tone="falu">Mentora</Pill>
                                            <Pill tone="orange">90 días</Pill>
                                            <Pill tone="neutral">Rutina diaria</Pill>
                                        </div>

                                        {/* Redes */}
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

                                        {/* CTAs */}
                                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                            <PrimaryCTA>Comenzar proceso</PrimaryCTA>
                                            <SecondaryLink href="/metodo">Ver el método</SecondaryLink>
                                        </div>
                                    </div>
                                </Card>
                            </div>


                            {/* Texto / Cita */}
                            <div className="lg:col-span-6">
                                <Pill tone="falu">La historia</Pill>

                                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                                    Una experiencia real,{" "}
                                    <span className="text-falu-red-800">convertida en método</span>.
                                </h2>

                                <p className="mt-5 max-w-3xl text-base text-zinc-600 sm:text-lg">
                                    El Método 590 nació de una necesidad real: aprender inglés en tres meses
                                    para superar una entrevista completamente en inglés y poder venir a estudiar
                                    a Estados Unidos.
                                </p>

                                {/* Quote block diferente */}
                                <div className="mt-8 rounded-2xl bg-white/75 p-6 ring-1 ring-inset ring-zinc-200">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 inline-flex h-7 w-14 items-center justify-center rounded-xl bg-yellow-orange-100 text-yellow-orange-900 font-extrabold">
                                            “
                                        </span>

                                        <blockquote className="text-sm leading-relaxed text-zinc-700">
                                            <p>{mentora.quote}</p>
                                            <footer className="mt-4 flex items-center gap-2 text-xs font-semibold text-zinc-600">
                                                <span>— {mentora.name}</span>
                                                <span className="text-zinc-400">•</span>
                                                <span>{mentora.role}</span>
                                            </footer>
                                        </blockquote>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <SecondaryLink href="/sesiones">Ver sesiones →</SecondaryLink>
                                    <SecondaryLink href="/ciencia">Ver ciencia →</SecondaryLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* CONTENIDO NARRATIVO */}
            <section className="py-12 sm:py-16">
                <Container>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                        <div className="lg:col-span-7 space-y-6">
                            <Card className="p-6">
                                <Pill tone="neutral">El problema</Pill>
                                <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                                    Los métodos tradicionales eran lentos, fragmentados y pasivos. No había
                                    tiempo para “probar y esperar”. Hacía falta una estructura diaria que obligara
                                    al cerebro a exponerse, practicar y producir inglés todos los días.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <Pill tone="orange">La investigación</Pill>
                                <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                                    Comencé a investigar cómo el ser humano adquiere su idioma nativo:
                                    exposición constante, escucha, imitación y producción dentro de un entorno natural.
                                    A partir de ese proceso, diseñé una estructura basada en cinco sesiones diarias.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <Pill tone="falu">La transformación</Pill>
                                <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                                    Lo probé conmigo misma. Funcionó. Lo que comenzó como un método personal hoy se ha
                                    convertido en un sistema que ayuda a estudiantes en distintos países a transformar
                                    su relación con el inglés: de estudiarlo, a vivirlo y usarlo con seguridad real.
                                </p>
                            </Card>
                        </div>

                        <div className="lg:col-span-5">
                            <Card className="relative overflow-hidden bg-yellow-orange-50/50 p-6">
                                <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-yellow-orange-300/15 blur-3xl" />
                                <div className="pointer-events-none absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-falu-red-300/15 blur-3xl" />

                                <div className="relative">
                                    <Pill tone="neutral">Lo que vas a sentir</Pill>
                                    <h3 className="mt-4 text-xl font-extrabold text-zinc-900">
                                        Menos duda, más claridad
                                    </h3>
                                    <p className="mt-2 text-sm text-zinc-700">
                                        Porque hay estructura. Sabes qué hacer cada día, por qué lo haces y cómo esa
                                        repetición se convierte en fluidez.
                                    </p>

                                    <div className="mt-5 space-y-3">
                                        {[
                                            "Rutina diaria de 90 días",
                                            "Producción real (speaking + journaling)",
                                            "Seguimiento del progreso",
                                            "Aprendizaje basado en consistencia",
                                        ].map((t) => (
                                            <div
                                                key={t}
                                                className="flex items-start gap-3 rounded-xl bg-white/75 p-3 ring-1 ring-inset ring-zinc-200"
                                            >
                                                <span className="mt-1 h-2 w-2 rounded-full bg-falu-red-600" />
                                                <p className="text-sm text-zinc-700">{t}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <PrimaryCTA>Ir al formulario</PrimaryCTA>
                                        <Link
                                            href="/"
                                            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:bg-white transition"
                                        >
                                            Volver al home
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
