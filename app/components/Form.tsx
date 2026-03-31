"use client";

import { useEffect, useState } from "react";

const planDetails = {
    Essential: {
        description:
            "Plan Essential, incluye: Acceso completo a la plataforma, Rutina diaria guiada, Grupo de WhatsApp, Clases prácticas los viernes",
    },
};

type PlanType = keyof typeof planDetails;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const today = new Date();
today.setDate(today.getDate() - 1);
const yesterday = today.toISOString().split("T")[0];

const availableDates = [
    { value: "2026-04-06", label: "6 de Abril de 2026" },
    { value: "2026-05-04", label: "4 de Mayo de 2026" },
    { value: "2026-06-01", label: "1 de Junio de 2026" },
].filter((d) => d.value > yesterday);

// ─── Subcomponentes de UI ─────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-zinc-700 mb-1.5">
            {children}
        </label>
    );
}

const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300";

const selectClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 transition focus:outline-none focus:ring-2 focus:ring-falu-red-400 focus:border-transparent focus:bg-white hover:border-zinc-300 appearance-none cursor-pointer";

// ─── Componente principal ─────────────────────────────────────────────────────

const PaymentForm = ({ selectedPlan }: { selectedPlan: PlanType }) => {
    const [plan, setPlan] = useState<PlanType>(selectedPlan);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        confirmEmail: "",
        fullName: "",
        country: "",
        englishLevel: "",
        motive: "",
        interestDate: "",
    });
    const [error, setError] = useState("");

    useEffect(() => { setPlan(selectedPlan); }, [selectedPlan]);

    const validateForm = () => {
        if (!formData.email || !formData.fullName)
            return "Todos los campos obligatorios deben completarse";
        if (formData.email !== formData.confirmEmail)
            return "Los correos electrónicos no coinciden";
        if (!formData.country || !formData.englishLevel || !formData.motive)
            return "Debes completar todos los campos obligatorios";
        return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "plan") { setPlan(value as PlanType); return; }
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        const validationError = validateForm();
        if (validationError) { setError(validationError); return; }
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    fullName: formData.fullName.trim(),
                    country: formData.country,
                    plan,
                    level: formData.englishLevel,
                    motive: formData.motive,
                    interestDate: formData.interestDate,
                    description: planDetails[plan].description,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Error creando sesión");
            window.location.href = data.url;
        } catch (err: any) {
            console.error("Error Checkout:", err);
            setError("No pudimos iniciar tu pago. Intenta nuevamente.");
            setLoading(false);
        }
    };

    return (
        <section className="relative py-16 sm:py-20 overflow-hidden bg-zinc-50">
            {/* Fondos decorativos */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-falu-red-200/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-yellow-orange-200/15 blur-3xl" />

            <div className="relative mx-auto max-w-2xl px-4 sm:px-6">

                {/* Encabezado */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-200 mb-4">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Cupos disponibles para abril y mayo
                    </div>
                    <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
                        Comenzá tu camino en inglés
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        Completá el formulario y te reservamos tu cupo en el Plan Essential.
                    </p>
                </div>

                {/* Card del formulario */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden">

                    {/* Banda superior de color */}
                    <div className="h-1.5 w-full bg-linear-to-r from-falu-red-700 via-falu-red-500 to-yellow-orange-400" />

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">

                        {/* Email en dos columnas en desktop */}
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

                        {/* Error de correos */}
                        {error && (
                            <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Nombre */}
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

                        {/* País + Plan en dos columnas */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <FieldLabel htmlFor="country">País donde resides *</FieldLabel>
                                <div className="relative">
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={selectClass}
                                        required
                                    >
                                        <option value="">Selecciona tu país</option>
                                        <option value="Canadá">Canadá</option>
                                        <option value="Estados Unidos">Estados Unidos</option>
                                        <option value="México">México</option>
                                        <option value="Guatemala">Guatemala</option>
                                        <option value="Belice">Belice</option>
                                        <option value="Honduras">Honduras</option>
                                        <option value="El Salvador">El Salvador</option>
                                        <option value="Nicaragua">Nicaragua</option>
                                        <option value="Costa Rica">Costa Rica</option>
                                        <option value="Panamá">Panamá</option>
                                        <option value="Cuba">Cuba</option>
                                        <option value="República Dominicana">República Dominicana</option>
                                        <option value="Puerto Rico">Puerto Rico</option>
                                        <option value="Haití">Haití</option>
                                        <option value="Jamaica">Jamaica</option>
                                        <option value="Bahamas">Bahamas</option>
                                        <option value="Barbados">Barbados</option>
                                        <option value="Trinidad y Tobago">Trinidad y Tobago</option>
                                        <option value="Antigua y Barbuda">Antigua y Barbuda</option>
                                        <option value="San Cristóbal y Nieves">San Cristóbal y Nieves</option>
                                        <option value="Santa Lucía">Santa Lucía</option>
                                        <option value="San Vicente y las Granadinas">San Vicente y las Granadinas</option>
                                        <option value="Granada">Granada</option>
                                        <option value="Dominica">Dominica</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Venezuela">Venezuela</option>
                                        <option value="Guyana">Guyana</option>
                                        <option value="Surinam">Surinam</option>
                                        <option value="Ecuador">Ecuador</option>
                                        <option value="Perú">Perú</option>
                                        <option value="Bolivia">Bolivia</option>
                                        <option value="Brasil">Brasil</option>
                                        <option value="Paraguay">Paraguay</option>
                                        <option value="Uruguay">Uruguay</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Chile">Chile</option>
                                        <option value="España">España</option>
                                        <option value="Guinea Ecuatorial">Guinea Ecuatorial</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <FieldLabel htmlFor="plan">Plan seleccionado *</FieldLabel>
                                <div className="relative">
                                    <select
                                        id="plan"
                                        name="plan"
                                        value={plan}
                                        onChange={handleChange}
                                        className={selectClass}
                                        required
                                    >
                                        <option value="Essential">Essential — $10/mes</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fecha de inicio */}
                        <div>
                            <FieldLabel htmlFor="interestDate">Fecha de inicio *</FieldLabel>
                            <div className="relative">
                                <select
                                    id="interestDate"
                                    name="interestDate"
                                    value={formData.interestDate}
                                    onChange={handleChange}
                                    className={selectClass}
                                    required
                                >
                                    <option value="">Selecciona una fecha</option>
                                    {availableDates.map((date) => (
                                        <option key={date.value} value={date.value}>
                                            {date.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            {/* Nota de inicio */}
                            <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-falu-red-50 border border-falu-red-100 px-4 py-3">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-falu-red-500" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <div>
                                    <p className="text-xs font-semibold text-falu-red-900">Importante sobre el inicio</p>
                                    <p className="mt-0.5 text-xs text-falu-red-700">
                                        Tu acceso comenzará en la fecha seleccionada. El pago reserva tu cupo, pero las clases no inician de inmediato.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nivel + Motivo en dos columnas */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <FieldLabel htmlFor="englishLevel">Nivel de inglés *</FieldLabel>
                                <div className="relative">
                                    <select
                                        id="englishLevel"
                                        name="englishLevel"
                                        value={formData.englishLevel}
                                        onChange={handleChange}
                                        className={selectClass}
                                        required
                                    >
                                        <option value="">Selecciona tu nivel</option>
                                        <option value="Principiante">Principiante (A1)</option>
                                        <option value="Basico">Básico (A2)</option>
                                        <option value="Intermedio">Intermedio (B1)</option>
                                        <option value="Intermedio alto-gramatica">Intermedio alto (B2.1)</option>
                                        <option value="Intermedio alto-produccion">Intermedio alto (B2.2)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <FieldLabel htmlFor="motive">Motivo principal *</FieldLabel>
                                <div className="relative">
                                    <select
                                        id="motive"
                                        name="motive"
                                        value={formData.motive}
                                        onChange={handleChange}
                                        className={selectClass}
                                        required
                                    >
                                        <option value="">Selecciona un motivo</option>
                                        <option value="Trabajo o mejores oportunidades laborales">
                                            Trabajo o mejores oportunidades laborales
                                        </option>
                                        <option value="Estudios/Universidad">Estudios / Universidad</option>
                                        <option value="Vivir en otro país">Vivir en otro país</option>
                                        <option value="Viajar">Viajar</option>
                                        <option value="Crecimiento personal y confianza">
                                            Crecimiento personal y confianza
                                        </option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divisor */}
                        <div className="border-t border-zinc-100 pt-2" />

                        {/* CTA */}
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
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    Reservar mi cupo — $10/mes
                                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                                <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 2l1.5 4.5H14l-3.5 2.5 1.5 4.5L8 11l-4 2.5 1.5-4.5L2 6.5h4.5L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                </svg>
                                Pago seguro vía Stripe
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                                <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 16 16" fill="none">
                                    <path d="M13 4L6.5 11 3 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Sin contratos ni compromisos
                            </span>
                        </div>

                    </form>
                </div>
            </div>
        </section>
    );
};

export default PaymentForm;