import { Container } from "./Container";
import ReactCountryFlag from "react-country-flag";

type Testimonial = {
    name: string;
    country: string;
    countryCode: string;
    text: string;
};
const testimonials: Testimonial[] = [
    {
        name: "María Fernández",
        country: "España",
        countryCode: "ES",
        text: "Me ayudó a crear rutina y por fin hablar sin miedo.",
    },
    {
        name: "Juan Pérez",
        country: "Honduras",
        countryCode: "HN",
        text: "Con el método entendí cómo practicar cada día sin improvisar.",
    },
    {
        name: "Camila Rojas",
        country: "Chile",
        countryCode: "CL",
        text: "Ahora sí tengo un plan diario. Me siento más segura al hablar.",
    },
];

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
                "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5",
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
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                styles,
            ].join(" ")}
        >
            {children}
        </span>
    );
}

export function TestimonialsSection() {
    return (
        <section className="py-14 sm:py-18 bg-white">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <Pill tone="orange">Testimonios</Pill>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Resultados que se sienten
                    </h2>
                    <p className="mt-4 text-zinc-600">
                        Confianza, estructura y fluidez real con práctica diaria.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {testimonials.map((t) => (
                        <Card key={`${t.name}-${t.country}`} className="hover:ring-yellow-orange-200">
                            <Pill tone="orange">Experiencia</Pill>

                            <p className="mt-4 text-sm text-zinc-700 leading-relaxed">
                                <span className="text-zinc-400 font-extrabold">“</span>
                                {t.text}
                                <span className="text-zinc-400 font-extrabold">”</span>
                            </p>

                            <div className="mt-5 flex items-center gap-3">
                                {/* banderita */}
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-inset ring-zinc-200">
                                    <ReactCountryFlag
                                        countryCode={t.countryCode}
                                        svg
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "100px",
                                        }}
                                        aria-label={t.country}
                                        title={t.country}
                                    />
                                </span>

                                {/* nombre + país */}
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900 leading-tight">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 leading-tight">{t.country}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
