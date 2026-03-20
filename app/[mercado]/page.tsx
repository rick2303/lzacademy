// app/[mercado]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Server Component. Next.js genera estáticamente /mexico, /colombia,
// /latinos-usa y /honduras en build time vía generateStaticParams.
//
// Para añadir un nuevo mercado: edita lib/markets.ts únicamente.
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { getMarketBySlug, getAllMarketSlugs } from '../lib/markets';
import { Container } from "@/app/components/Container";
import Card from "@/app/components/Card";
import Pill from "@/app/components/Pill";
import PaymentFormWrapper from "./_components/PaymentFormWrapper";

// Fechas de inicio — mantener sincronizado con page.tsx raíz
const NEXT_STARTS = ["6 de abril, 2026", "4 de mayo, 2026"];

// ─── Rutas estáticas ──────────────────────────────────────────────────────────
export function generateStaticParams() {
    return getAllMarketSlugs().map((slug) => ({ mercado: slug }));
}

// ─── SEO por mercado ──────────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ mercado: string }>;
}): Promise<Metadata> {
    const { mercado } = await params;
    const market = getMarketBySlug(mercado);

    if (!market) return { title: "No encontrado | LZ English Academy" };

    const { seo } = market;
    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: { canonical: seo.canonical },
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: seo.canonical,
            siteName: "LZ English Academy",
            images: [{ url: "https://lz-englishacademy.com/og-image.jpg" }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: seo.title,
            description: seo.description,
            images: ["https://lz-englishacademy.com/og-image.jpg"],
        },
    };
}

// ─── Schema.org JSON-LD ───────────────────────────────────────────────────────
function SchemaJsonLd({
    market,
}: {
    market: NonNullable<ReturnType<typeof getMarketBySlug>>;
}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "Método 590 — LZ English Academy",
        description: market.seo.description,
        provider: {
            "@type": "Organization",
            name: "LZ English Academy",
            url: "https://lz-englishacademy.com",
        },
        url: market.seo.canonical,
        inLanguage: market.schema?.inLanguage ?? "es",
        ...(market.schema?.areaServed && {
            areaServed: { "@type": "Country", identifier: market.schema.areaServed },
        }),
        offers: {
            "@type": "Offer",
            price: "10",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function MarketPage({
    params,
}: {
    params: Promise<{ mercado: string }>;
}) {
    const { mercado } = await params;
    const market = getMarketBySlug(mercado);

    if (!market) notFound();

    const { hero, whySection, testimonials, finalCta } = market;

    return (
        <>
            <SchemaJsonLd market={market} />

            <main className="bg-white">

                {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden">
                    {/* Fondos decorativos — idénticos al hero principal */}
                    <div className="absolute inset-0 bg-linear-to-b from-falu-red-100 via-white to-falu-red-50" />
                    <div className="pointer-events-none absolute -top-32 left-1/2 h-104 w-104 -translate-x-1/2 rounded-full bg-falu-red-400/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-40 -right-24 h-120 w-120 rounded-full bg-yellow-orange-300/20 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,rgba(156,24,29,0.35)_1px,transparent_0)] bg-size-[18px_18px]" />
                    <svg
                        className="pointer-events-none absolute -bottom-px left-0 w-full"
                        viewBox="0 0 1440 120"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M0 80C120 70 240 55 360 52C480 48 600 64 720 72C840 80 960 78 1080 62C1200 46 1320 18 1440 10V120H0V80Z"
                            fill="rgba(156,24,29,0.06)"
                        />
                    </svg>

                    <Container>
                        <div className="relative py-16 sm:py-24">
                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

                                {/* Columna izquierda */}
                                <div className="lg:col-span-7">
                                    {/* Urgencia — próxima fecha */}
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-falu-red-200/80 mb-5">
                                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        Próximo inicio: {NEXT_STARTS[0]}
                                    </div>

                                    <Pill tone="falu">{hero.pill}</Pill>

                                    <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl leading-[1.1]">
                                        <span className="block">{hero.headline}</span>
                                        <span className="block text-falu-red-800">{hero.headlineAccent}</span>
                                    </h1>

                                    <p className="mt-5 max-w-xl text-base text-zinc-700 sm:text-lg leading-relaxed">
                                        {hero.subheadline}
                                    </p>

                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                        <a
                                            href="#planes"
                                            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition shadow-sm"
                                        >
                                            {hero.ctaPrimary}
                                        </a>
                                        <Link
                                            href="/metodo"
                                            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                                        >
                                            Ver cómo funciona →
                                        </Link>
                                    </div>

                                    {/* Stats del mercado */}
                                    <div className="mt-10 grid grid-cols-3 gap-3">
                                        {hero.stats.map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="rounded-xl bg-white/80 px-3 py-3 ring-1 ring-inset ring-falu-red-100 text-center"
                                            >
                                                <p className="text-base font-extrabold text-zinc-900">{stat.value}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Columna derecha — razones específicas para este mercado */}
                                <div className="lg:col-span-5">
                                    <Card className="relative overflow-hidden ring-falu-red-200">
                                        <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-falu-red-300/20 blur-3xl" />
                                        <p className="text-sm font-semibold text-zinc-900 relative">
                                            {whySection.title}
                                        </p>
                                        <ul className="mt-4 space-y-3 text-sm text-zinc-700 relative">
                                            {whySection.points.map((point, i) => (
                                                <li key={i} className="flex gap-3">
                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-falu-red-600" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-5 pt-4 border-t border-zinc-100 relative">
                                            <Link
                                                href="/historia"
                                                className="text-xs font-semibold text-falu-red-800 hover:text-falu-red-900"
                                            >
                                                Conocer la historia de Loren →
                                            </Link>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
            PLANES
        ══════════════════════════════════════════════════════════════════ */}
                <section id="planes" className="bg-white py-16 sm:py-20">
                    <Container>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-zinc-900">
                                Elige el plan que se adapta a tu ritmo
                            </h2>
                            <p className="mt-3 text-sm text-zinc-600">
                                Próximos inicios:{" "}
                                <span className="font-semibold text-zinc-800">{NEXT_STARTS[0]}</span>
                                {" · "}
                                <span className="font-semibold text-zinc-800">{NEXT_STARTS[1]}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {/* Essential */}
                            <Card className="flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-extrabold text-zinc-900">Curso Essential</h3>
                                    <p className="mt-2 text-sm text-zinc-600">
                                        80% autodidacta con estructura clara. Ideal para personas disciplinadas
                                        que quieren avanzar con apoyo.
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                                        {[
                                            "Acceso completo a la plataforma",
                                            "Comunidad en WhatsApp",
                                            "Material organizado por sesiones y nivel",
                                            "Método paso a paso para guiar tu aprendizaje diario",
                                            "Reuniones de práctica los viernes (varios horarios)",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-falu-red-600" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-3 text-xs text-zinc-400 italic">
                                        Inicia en la fecha que selecciones en el formulario.
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <p className="text-lg font-semibold text-falu-red-800">$10/mes</p>
                                    <a
                                        href="#form"
                                        className="mt-3 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm"
                                    >
                                        Reservar Essential — $10/mes
                                    </a>
                                </div>
                            </Card>

                            {/* Premium — destacado */}
                            <Card className="flex flex-col justify-between ring-2 ring-falu-red-400">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-extrabold text-zinc-900">Curso Premium</h3>
                                        <span className="rounded-full bg-falu-red-100 px-3 py-1 text-xs font-semibold text-falu-red-800">
                                            Más completo
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-zinc-600">
                                        Todo el Essential más clases diarias en vivo y seguimiento personalizado.
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                                        {[
                                            "Todo lo del plan Essential",
                                            "1 hora de clase diaria (lunes a jueves)",
                                            "Repasos y resolución de dudas los viernes",
                                            "Seguimiento y motivación constante",
                                            "Estructura para lograr fluidez en menos tiempo",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-falu-red-600" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-3 text-xs text-zinc-400 italic">
                                        Agendas tu clase el lunes según tu nivel — horario fijo lunes a jueves.
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <p className="text-lg font-semibold text-falu-red-800">$50/mes</p>
                                    <a
                                        href="#form"
                                        className="mt-3 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm"
                                    >
                                        Seleccionar Premium — $50/mes
                                    </a>
                                </div>
                            </Card>

                            {/* Speaking */}
                            <Card className="flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-extrabold text-zinc-900">Sesión de Speaking</h3>
                                    <p className="mt-2 text-sm text-zinc-600">
                                        Sesión 1:1 de 30 minutos. Conversación real, corrección de gramática
                                        y pronunciación en tiempo real.
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                                        {[
                                            "Conversación según tu nivel",
                                            "Corrección de gramática en tiempo real",
                                            "Trabajo de pronunciación",
                                            "Puede extenderse sin costo extra",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-falu-red-600" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-3 text-xs text-falu-red-800 font-medium">
                                        * Miembros activos reciben descuento en esta sesión.
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <p className="text-lg font-semibold text-falu-red-800">$15 / sesión</p>
                                    <a
                                        href="#form"
                                        className="mt-3 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm"
                                    >
                                        Reservar sesión — $15
                                    </a>
                                </div>
                            </Card>

                        </div>
                    </Container>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
            TESTIMONIOS DEL MERCADO
        ══════════════════════════════════════════════════════════════════ */}
                {testimonials.length > 0 && (
                    <section className="py-14 sm:py-16 bg-falu-red-50/40">
                        <Container>
                            <h2 className="text-2xl font-extrabold text-center text-zinc-900 mb-8">
                                Lo que dicen quienes ya lo hicieron
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
                                {testimonials.map((t, i) => (
                                    <Card key={i} className="flex flex-col gap-4">
                                        <p className="text-sm text-zinc-700 leading-relaxed">
                                            &ldquo;{t.quote}&rdquo;
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-zinc-100">
                                            <div className="h-8 w-8 rounded-full bg-falu-red-100 flex items-center justify-center text-xs font-bold text-falu-red-800 shrink-0">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                                                <p className="text-xs text-zinc-500">{t.location}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Container>
                    </section>
                )}

                {/* ══════════════════════════════════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-16 sm:py-20">
                    <div className="absolute inset-0 bg-linear-to-b from-falu-red-50 via-white to-falu-red-50/40" />
                    <Container>
                        <Card className="relative overflow-hidden ring-falu-red-200">
                            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-falu-red-300/18 blur-3xl" />
                            <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-falu-red-400/14 blur-3xl" />
                            <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                                <div className="lg:col-span-8">
                                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                        {finalCta.headline}
                                    </h2>
                                    <p className="mt-3 text-zinc-600">{finalCta.body}</p>
                                    <p className="mt-2 text-sm text-zinc-500">
                                        Próximo inicio:{" "}
                                        <span className="font-semibold text-zinc-700">{NEXT_STARTS[0]}</span>
                                    </p>
                                </div>
                                <div className="lg:col-span-4 flex flex-col gap-3 lg:justify-end">
                                    <a
                                        href="#form"
                                        className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm"
                                    >
                                        {finalCta.button}
                                    </a>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                                    >
                                        Volver al inicio
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </Container>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
            FORMULARIO
        ══════════════════════════════════════════════════════════════════ */}
                <section id="form">
                    <PaymentFormWrapper />
                </section>

            </main>
        </>
    );
}