import InterestForm from "../components/InterestForm";

export const metadata = {
    title: "Formulario de Interés — LZ English Academy",
    description:
        "Muestra tu interés en el Método 590. Completa el formulario y recibe información detallada sobre el programa, su estructura y los pasos para inscribirte.",
};

export default function InterestPage() {
    return (
        <main className="relative min-h-screen bg-zinc-50 overflow-hidden">
            {/* Fondos decorativos */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-falu-red-200/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 right-0 h-72 w-72 rounded-full bg-yellow-orange-200/15 blur-3xl" />

            <div className="relative mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-20">

                {/* ── Encabezado ── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-200 mb-4">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Cupos limitados — sin costo al completar
                    </div>

                    <h1 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl leading-tight">
                        Formulario de interés
                    </h1>
                    <p className="mt-3 text-base text-zinc-500 max-w-lg mx-auto leading-relaxed">
                        El <strong className="text-zinc-700">Método 590</strong> es un programa intensivo de inglés diseñado para que desarrolles disciplina, constancia y confianza — incluso desde cero.
                    </p>
                </div>

                {/* ── Aviso informativo ── */}
                <div className="mb-8 rounded-2xl bg-white border border-zinc-200 p-5 shadow-sm">
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Más que un curso, este programa es una guía estructurada para crear hábitos diarios, perder el miedo a hablar y aprender dentro de una comunidad que se apoya y crece junta.
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {[
                            { icon: "💬", text: "Comunidad activa en WhatsApp" },
                            { icon: "📅", text: "Sesiones de práctica los viernes" },
                            { icon: "💰", text: "Desde $10 al mes" },
                        ].map((item) => (
                            <div key={item.text} className="flex items-center gap-2 text-xs text-zinc-500">
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Formulario ── */}
                <InterestForm />

            </div>
        </main>
    );
}
