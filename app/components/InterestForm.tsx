"use client";

import { useState, useRef } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300";

const selectClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300 appearance-none cursor-pointer";

const textareaClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300 resize-none";

const STEPS = [
    { title: "Tus datos", subtitle: "Empecemos con tu información básica" },
    { title: "Tu inglés", subtitle: "Cuéntanos sobre tu nivel actual" },
    { title: "Para terminar", subtitle: "Casi listo — solo unas últimas preguntas" },
];

function FieldLabel({ htmlFor, children, optional = false }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
    return (
        <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-1.5">
            {children}
            {optional && <span className="text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">Opcional</span>}
        </label>
    );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            {children}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

function RadioGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (val: string) => void }) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition border ${
                        value === opt
                            ? "bg-falu-red-700 text-white border-falu-red-700 shadow-sm"
                            : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100"
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}

export default function InterestForm() {
    const [step, setStep] = useState(0);
    const [visible, setVisible] = useState(true);
    const [slideDir, setSlideDir] = useState<"left" | "right">("left");

    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        country: "",
        englishLevel: "",
        motive: "",
        mainDifficulty: "",
        dailyRoutine: "",
        lifeChange: "",
        additionalInfo: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const setField = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const animateToStep = (newStep: number) => {
        const dir = newStep > step ? "left" : "right";
        setSlideDir(dir);
        setVisible(false);
        setTimeout(() => {
            setStep(newStep);
            setVisible(true);
        }, 180);
    };

    const validateStep = (): string | null => {
        if (step === 0) {
            if (!formData.email) return "El correo electrónico es obligatorio";
            if (!formData.email.includes("@")) return "Ingresa un correo válido";
            if (!formData.fullName.trim()) return "El nombre completo es obligatorio";
            if (!formData.country) return "Selecciona tu país";
        }
        if (step === 1) {
            if (!formData.englishLevel) return "Selecciona tu nivel de inglés";
            if (!formData.motive) return "Selecciona tu motivo principal";
            if (!formData.mainDifficulty) return "Selecciona tu mayor dificultad";
        }
        if (step === 2) {
            if (!formData.dailyRoutine) return "Indica si puedes seguir una rutina diaria";
        }
        return null;
    };

    const next = () => {
        const err = validateStep();
        if (err) { setError(err); return; }
        setError("");
        animateToStep(step + 1);
    };

    const back = () => {
        setError("");
        animateToStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateStep();
        if (err) { setError(err); return; }
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/send-interest-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    fullName: formData.fullName.trim(),
                    country: formData.country,
                    englishLevel: formData.englishLevel,
                    motive: formData.motive,
                    mainDifficulty: formData.mainDifficulty,
                    dailyRoutine: formData.dailyRoutine,
                    lifeChange: formData.lifeChange || undefined,
                    additionalInfo: formData.additionalInfo || undefined,
                }),
            });
            if (!res.ok) throw new Error("Error al enviar");
            setSubmitted(true);
        } catch {
            setError("Hubo un problema al enviar tu formulario. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden">
                <div className="h-1.5 w-full bg-linear-to-r from-falu-red-700 via-falu-red-500 to-yellow-orange-400" />
                <div className="p-8 sm:p-12 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 ring-2 ring-green-200">
                        <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">¡Recibimos tu interés!</h3>
                    <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
                        Revisa tu correo electrónico — te enviamos un mensaje con información detallada sobre el Método 590 y los próximos pasos.
                    </p>
                    <p className="mt-4 text-xs text-zinc-400">¿No lo ves? Revisa tu carpeta de spam.</p>
                </div>
            </div>
        );
    }

    const progress = ((step + 1) / STEPS.length) * 100;

    const contentStyle: React.CSSProperties = {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${slideDir === "left" ? "16px" : "-16px"})`,
        transition: "opacity 0.18s ease, transform 0.18s ease",
    };

    return (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden">
            {/* Barra de progreso */}
            <div className="h-1.5 w-full bg-zinc-100">
                <div
                    className="h-full bg-linear-to-r from-falu-red-700 via-falu-red-500 to-yellow-orange-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-6 sm:p-8">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-7">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 flex-1">
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                        i < step
                                            ? "bg-green-500 text-white"
                                            : i === step
                                            ? "bg-falu-red-700 text-white ring-4 ring-falu-red-100"
                                            : "bg-zinc-100 text-zinc-400"
                                    }`}
                                >
                                    {i < step ? (
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
                                            <path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-zinc-700" : "text-zinc-400"}`}>
                                    {s.title}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-0.5 flex-1 rounded-full mb-4 transition-all duration-500 ${i < step ? "bg-green-400" : "bg-zinc-100"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Título del step */}
                <div style={contentStyle}>
                    <div className="mb-6">
                        <h2 className="text-lg font-extrabold text-zinc-900">{STEPS[step].title}</h2>
                        <p className="text-sm text-zinc-500 mt-0.5">{STEPS[step].subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* ── STEP 0: Datos personales ── */}
                        {step === 0 && (
                            <div className="space-y-5">
                                <div>
                                    <FieldLabel htmlFor="email">Correo electrónico *</FieldLabel>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@correo.com"
                                        className={inputClass}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <FieldLabel htmlFor="fullName">Nombre completo *</FieldLabel>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Tu nombre completo"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <FieldLabel htmlFor="country">País donde resides *</FieldLabel>
                                    <SelectWrapper>
                                        <select id="country" name="country" value={formData.country} onChange={handleChange} className={selectClass}>
                                            <option value="">Selecciona tu país</option>
                                            <option>México</option>
                                            <option>Estados Unidos</option>
                                            <option>Canadá</option>
                                            <option>Costa Rica</option>
                                            <option>El Salvador</option>
                                            <option>Guatemala</option>
                                            <option>Honduras</option>
                                            <option>Nicaragua</option>
                                            <option>Panamá</option>
                                            <option>Cuba</option>
                                            <option>Puerto Rico</option>
                                            <option>República Dominicana</option>
                                            <option>Argentina</option>
                                            <option>Bolivia</option>
                                            <option>Chile</option>
                                            <option>Colombia</option>
                                            <option>Ecuador</option>
                                            <option>Paraguay</option>
                                            <option>Perú</option>
                                            <option>Uruguay</option>
                                            <option>Venezuela</option>
                                            <option>España</option>
                                            <option>Francia</option>
                                            <option>Italia</option>
                                            <option>Guinea Ecuatorial</option>
                                            <option value="Otros">Otros</option>
                                        </select>
                                    </SelectWrapper>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 1: Tu inglés ── */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <FieldLabel htmlFor="englishLevel">¿Cuál es tu nivel de inglés actual? *</FieldLabel>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {[
                                            { val: "Principiante (A1)", label: "Principiante", sub: "A1 — Casi nada" },
                                            { val: "Básico (A2)", label: "Básico", sub: "A2 — Lo esencial" },
                                            { val: "Intermedio (B1)", label: "Intermedio", sub: "B1 — Me defiendo" },
                                            { val: "Intermedio alto (B2)", label: "Intermedio alto", sub: "B2 — Bastante fluido" },
                                            { val: "No estoy seguro/a", label: "No estoy seguro/a", sub: "Te ayudamos a identificarlo" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.val}
                                                type="button"
                                                onClick={() => setField("englishLevel", opt.val)}
                                                className={`text-left rounded-xl border p-3.5 transition ${
                                                    formData.englishLevel === opt.val
                                                        ? "border-falu-red-500 bg-falu-red-50 ring-1 ring-falu-red-300"
                                                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
                                                }`}
                                            >
                                                <p className={`text-sm font-semibold ${formData.englishLevel === opt.val ? "text-falu-red-800" : "text-zinc-800"}`}>{opt.label}</p>
                                                <p className="text-xs text-zinc-400 mt-0.5">{opt.sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <FieldLabel htmlFor="motive">¿Cuál es tu motivo principal? *</FieldLabel>
                                    <SelectWrapper>
                                        <select id="motive" name="motive" value={formData.motive} onChange={handleChange} className={selectClass}>
                                            <option value="">Selecciona un motivo</option>
                                            <option>Trabajo o mejores oportunidades laborales</option>
                                            <option>Estudios / Universidad</option>
                                            <option>Vivir en otro país</option>
                                            <option>Viajar</option>
                                            <option>Crecimiento personal y confianza</option>
                                            <option>Otros</option>
                                        </select>
                                    </SelectWrapper>
                                </div>

                                <div>
                                    <FieldLabel htmlFor="mainDifficulty">¿Qué es lo que más se te dificulta? *</FieldLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {["Hablar sin miedo", "Entender a nativos", "Vocabulario", "Gramática", "Pronunciación", "Falta de constancia", "Otros"].map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setField("mainDifficulty", opt)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                                                    formData.mainDifficulty === opt
                                                        ? "bg-falu-red-700 text-white border-falu-red-700 shadow-sm"
                                                        : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100"
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Para terminar ── */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <FieldLabel htmlFor="dailyRoutine">¿Estás dispuesto/a a seguir una rutina diaria de estudio? *</FieldLabel>
                                    <RadioGroup
                                        options={["Sí", "No", "Tal vez"]}
                                        value={formData.dailyRoutine}
                                        onChange={(val) => setField("dailyRoutine", val)}
                                    />
                                </div>

                                <div>
                                    <FieldLabel htmlFor="lifeChange" optional>¿Qué cambiaría en tu vida si hablaras inglés con confianza?</FieldLabel>
                                    <textarea
                                        id="lifeChange"
                                        name="lifeChange"
                                        value={formData.lifeChange}
                                        onChange={handleChange}
                                        placeholder="Imagina las posibilidades..."
                                        rows={3}
                                        className={textareaClass}
                                    />
                                </div>

                                <div>
                                    <FieldLabel htmlFor="additionalInfo" optional>¿Hay algo más que quieras contarnos?</FieldLabel>
                                    <textarea
                                        id="additionalInfo"
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleChange}
                                        placeholder="Cualquier cosa que quieras compartir..."
                                        rows={3}
                                        className={textareaClass}
                                    />
                                </div>

                                <div className="flex items-start gap-2 rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3">
                                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 16 16" fill="none">
                                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Este formulario <strong>no requiere pago</strong>. Recibirás un correo con información detallada del programa.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Navegación */}
                        <div className="mt-8 flex items-center gap-3">
                            {step > 0 && (
                                <button
                                    type="button"
                                    onClick={back}
                                    className="inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 transition"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                        <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Atrás
                                </button>
                            )}

                            {step < STEPS.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={next}
                                    className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition shadow-sm"
                                >
                                    Siguiente
                                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-auto inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none">
                                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
                                            </svg>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            Enviar formulario
                                            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
