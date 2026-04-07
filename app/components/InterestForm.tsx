"use client";

import { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300";

const selectClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300 appearance-none cursor-pointer";

const textareaClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300 resize-none";

function FieldLabel({
    htmlFor,
    children,
    optional = false,
}: {
    htmlFor: string;
    children: React.ReactNode;
    optional?: boolean;
}) {
    return (
        <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-1.5">
            {children}
            {optional && (
                <span className="text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                    Opcional
                </span>
            )}
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

function RadioGroup({
    name,
    options,
    value,
    onChange,
}: {
    name: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${value === opt
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

const COURSES = [
    { key: "Essential", price: "$10/mes", desc: "Acceso completo + comunidad" },
    { key: "Premium", price: "$50/mes", desc: "Todo Essential + tutorías" },
    { key: "Personalizado", price: "$100/mes", desc: "Todo Premium + Sesiones personales + Correcciones en tiempo real" },
    { key: "Speaking Sessions", price: "À la carte", desc: "Solo sesiones de speaking" },
];

export default function InterestForm() {
    const [formData, setFormData] = useState({
        email: "",
        confirmEmail: "",
        fullName: "",
        country: "",
        englishLevel: "",
        motive: "",
        mainDifficulty: "",
        dailyRoutine: "",
        dailyTime: "",
        community: "",
        interestedCourse: "",
        whyCommunity: "",
        lifeChange: "",
        additionalInfo: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const setField = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const validate = () => {
        if (!formData.email) return "El correo electrónico es obligatorio";
        if (formData.email !== formData.confirmEmail) return "Los correos no coinciden";
        if (!formData.fullName) return "El nombre completo es obligatorio";
        if (!formData.country) return "El país es obligatorio";
        if (!formData.englishLevel) return "El nivel de inglés es obligatorio";
        if (!formData.motive) return "El motivo es obligatorio";
        if (!formData.mainDifficulty) return "Indica tu mayor dificultad";
        if (!formData.dailyRoutine) return "Indica si puedes seguir una rutina diaria";
        if (!formData.dailyTime) return "Indica cuánto tiempo puedes dedicar";
        if (!formData.community) return "Indica si participarías en la comunidad";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        const validationError = validate();
        if (validationError) { setError(validationError); return; }
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
                    dailyTime: formData.dailyTime,
                    community: formData.community,
                    interestedCourse: formData.interestedCourse || undefined,
                    whyCommunity: formData.whyCommunity || undefined,
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
                    <p className="mt-4 text-xs text-zinc-400">
                        ¿No lo ves? Revisa tu carpeta de spam.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden">
            <div className="h-1.5 w-full bg-linear-to-r from-falu-red-700 via-falu-red-500 to-yellow-orange-400" />

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                {/* ── Sección 1: Datos básicos ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Información personal</p>
                    <div className="space-y-5">

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                    required
                                />
                            </div>
                            <div>
                                <FieldLabel htmlFor="confirmEmail">Confirma tu correo *</FieldLabel>
                                <input
                                    type="email"
                                    id="confirmEmail"
                                    name="confirmEmail"
                                    value={formData.confirmEmail}
                                    onChange={handleChange}
                                    placeholder="tu@correo.com"
                                    className={inputClass}
                                    required
                                />
                            </div>
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
                                required
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="country">País donde resides *</FieldLabel>
                            <SelectWrapper>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={selectClass}
                                    required
                                >
                                    <option value="">Selecciona tu país</option>

                                    {/* América del Norte */}
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
                </div>

                <div className="border-t border-zinc-100" />

                {/* ── Sección 2: Nivel e inglés ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Tu inglés</p>
                    <div className="space-y-5">

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <FieldLabel htmlFor="englishLevel">Nivel de inglés *</FieldLabel>
                                <SelectWrapper>
                                    <select id="englishLevel" name="englishLevel" value={formData.englishLevel} onChange={handleChange} className={selectClass} required>
                                        <option value="">Selecciona tu nivel</option>
                                        <option value="Principiante (A1)">Principiante (A1)</option>
                                        <option value="Básico (A2)">Básico (A2)</option>
                                        <option value="Intermedio (B1)">Intermedio (B1)</option>
                                        <option value="Intermedio alto (B2)">Intermedio alto (B2)</option>
                                        <option value="No estoy seguro/a">No estoy seguro/a</option>
                                    </select>
                                </SelectWrapper>
                            </div>
                            <div>
                                <FieldLabel htmlFor="motive">Motivo principal *</FieldLabel>
                                <SelectWrapper>
                                    <select id="motive" name="motive" value={formData.motive} onChange={handleChange} className={selectClass} required>
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
                        </div>

                        <div>
                            <FieldLabel htmlFor="mainDifficulty">¿Qué es lo que más se te dificulta en inglés? *</FieldLabel>
                            <SelectWrapper>
                                <select id="mainDifficulty" name="mainDifficulty" value={formData.mainDifficulty} onChange={handleChange} className={selectClass} required>
                                    <option value="">Selecciona una opción</option>
                                    <option>Hablar sin miedo</option>
                                    <option>Entender a hablantes nativos</option>
                                    <option>Vocabulario</option>
                                    <option>Gramática</option>
                                    <option>Pronunciación</option>
                                    <option>Falta de constancia o disciplina</option>
                                    <option>Otros</option>
                                </select>
                            </SelectWrapper>
                        </div>

                    </div>
                </div>

                <div className="border-t border-zinc-100" />

                {/* ── Sección 3: Compromiso ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Compromiso</p>
                    <div className="space-y-5">

                        <div>
                            <FieldLabel htmlFor="dailyRoutine">¿Estás dispuesto/a a estudiar inglés todos los días siguiendo una rutina estructurada? *</FieldLabel>
                            <RadioGroup
                                name="dailyRoutine"
                                options={["Sí", "No", "Tal vez"]}
                                value={formData.dailyRoutine}
                                onChange={(val) => setField("dailyRoutine", val)}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="dailyTime">¿Cuánto tiempo real puedes dedicar al inglés cada día? *</FieldLabel>
                            <SelectWrapper>
                                <select id="dailyTime" name="dailyTime" value={formData.dailyTime} onChange={handleChange} className={selectClass} required>
                                    <option value="">Selecciona una opción</option>
                                    <option>Menos de 1 hora</option>
                                    <option>1 hora</option>
                                    <option>2 horas</option>
                                    <option>3 horas</option>
                                    <option>4 horas</option>
                                    <option>5 horas</option>
                                    <option>6 horas o más</option>
                                </select>
                            </SelectWrapper>
                        </div>

                        <div>
                            <FieldLabel htmlFor="community">El Método 590 incluye grupos de WhatsApp y reuniones de práctica los viernes. ¿Estás dispuesto/a a participar? *</FieldLabel>
                            <RadioGroup
                                name="community"
                                options={["Sí", "No", "Tal vez"]}
                                value={formData.community}
                                onChange={(val) => setField("community", val)}
                            />
                        </div>

                    </div>
                </div>

                <div className="border-t border-zinc-100" />

                {/* ── Sección 4: Curso de interés (opcional) ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Curso de interés</p>
                    <p className="text-xs text-zinc-400 mb-4">Opcional — puedes dejarlo en blanco si aún no lo decides</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {COURSES.map((course) => (
                            <button
                                key={course.key}
                                type="button"
                                onClick={() =>
                                    setField(
                                        "interestedCourse",
                                        formData.interestedCourse === course.key ? "" : course.key
                                    )
                                }
                                className={`text-left rounded-xl border p-4 transition ${formData.interestedCourse === course.key
                                        ? "border-falu-red-500 bg-falu-red-50 ring-1 ring-falu-red-300"
                                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-zinc-800">{course.key}</span>
                                    <span className={`text-xs font-bold ${formData.interestedCourse === course.key ? "text-falu-red-700" : "text-zinc-500"}`}>
                                        {course.price}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400">{course.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-zinc-100" />

                {/* ── Sección 5: Preguntas abiertas (opcionales) ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Cuéntanos más</p>
                    <div className="space-y-5">

                        <div>
                            <FieldLabel htmlFor="whyCommunity" optional>¿Por qué te gustaría aprender inglés dentro de una comunidad y no completamente solo/a?</FieldLabel>
                            <textarea
                                id="whyCommunity"
                                name="whyCommunity"
                                value={formData.whyCommunity}
                                onChange={handleChange}
                                placeholder="Comparte tu perspectiva..."
                                rows={3}
                                className={textareaClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="lifeChange" optional>¿Qué cambiaría en tu vida si te sintieras seguro/a hablando inglés?</FieldLabel>
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
                            <FieldLabel htmlFor="additionalInfo" optional>¿Hay algo más que quieras contarnos sobre tu proceso con el inglés o sobre ti?</FieldLabel>
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

                    </div>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* ── Aviso pre-submit ── */}
                <div className="flex items-start gap-2 rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Este formulario <strong>no requiere pago</strong>. Completarlo no garantiza un cupo automático — los espacios son limitados. Después de enviarlo, recibirás un correo con información detallada del programa.
                    </p>
                </div>

                {/* ── Submit ── */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 active:bg-falu-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
                            Enviar formulario de interés
                            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </>
                    )}
                </button>

            </form>
        </div>
    );
}
