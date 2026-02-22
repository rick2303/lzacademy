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

const today = new Date().toISOString().split("T")[0];
const availableDates = [
    { value: "2026-03-09", label: "9 de Marzo de 2026" },
    { value: "2026-04-06", label: "6 de Abril de 2026" },
    { value: "2026-05-04", label: "4 de Mayo de 2026" },
].filter((d) => d.value !== today);

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

    useEffect(() => {
        setPlan(selectedPlan);
    }, [selectedPlan]);

    const validateForm = () => {
        if (!formData.email || !formData.fullName) {
            return "Todos los campos obligatorios deben completarse";
        }

        if (formData.email !== formData.confirmEmail) {
            return "Los correos electrónicos no coinciden";
        }

        if (!formData.country || !formData.englishLevel || !formData.motive) {
            return "Debes completar todos los campos obligatorios";
        }

        return null;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "plan") {
            setPlan(value as PlanType);
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

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

            if (!res.ok) {
                throw new Error(data?.error || "Error creando sesión");
            }

            window.location.href = data.url;
        } catch (err: any) {
            console.error("Error Checkout:", err);
            setError("No pudimos iniciar tu pago. Intenta nuevamente.");
            setLoading(false);
        }
    };
    return (

        <form onSubmit={handleSubmit} className="space-y-6 mt-8 max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold text-center text-zinc-800">
                Comenzá tu camino en inglés con el Plan Essential
            </h2>
            <p className="text-center text-zinc-600 mt-2">
                Inscribite completando el siguiente formulario
            </p>
            {/* Correo electrónico */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-700">
                    Correo electrónico *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 p-3 w-full border border-falu-red-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-falu-red-500"
                    required
                />
            </div>

            {/* Confirmar Correo electrónico */}
            <div>
                <label htmlFor="confirmEmail" className="block text-sm font-semibold text-zinc-700">
                    Confirma tu correo electrónico *
                </label>
                <input
                    type="email"
                    id="confirmEmail"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    className="mt-2 p-3 w-full border border-falu-red-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-falu-red-500"
                    required
                />
            </div>

            {/* Mostrar error si los correos no coinciden */}
            {error && <div className="text-red-600 text-sm">{error}</div>}

            {/* Nombre completo */}
            <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-zinc-700">
                    Nombre completo *
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-2 p-3 w-full border border-falu-red-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-falu-red-500"
                    required
                />
            </div>

            {/* País */}
            <div>
                <label htmlFor="country" className="block text-sm font-semibold text-zinc-700">
                    País donde resides actualmente: *
                </label>
                <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-2 p-3 w-full border border-falu-red-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-falu-red-500"
                    required
                >
                    <option value="">Selecciona tu país</option>

                    {/* América del Norte */}
                    <option value="Canadá">Canadá</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="México">México</option>

                    {/* Centroamérica */}
                    <option value="Guatemala">Guatemala</option>
                    <option value="Belice">Belice</option>
                    <option value="Honduras">Honduras</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Panamá">Panamá</option>

                    {/* Caribe */}
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

                    {/* Sudamérica */}
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

                    {/* Países de habla hispana fuera de América */}
                    <option value="España">España</option>
                    <option value="Guinea Ecuatorial">Guinea Ecuatorial</option>

                    {/* Otros */}
                    <option value="Otro">Otro</option>
                </select>
            </div>

            {/* Plan de interés */}
            <div>
                <label htmlFor="plan" className="block text-sm font-semibold text-zinc-700">
                    Selecciona el plan de tu interés *
                </label>
                <select
                    id="plan"
                    name="plan"
                    value={plan}
                    onChange={handleChange}
                    className="mt-2 p-3 w-full border border-falu-red-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-falu-red-500"
                    required
                >
                    <option value="Essential">Essential</option>
                    { /* <option value="Premium">Premium</option> */}
                    { /* <option value="Speaking">Sesión de speaking</option> */}
                </select>
            </div>
            {/*Fecha de interes para inicio de curso*/}
            <div>
                <label htmlFor="interestDate" className="block text-sm font-semibold text-zinc-700">
                    Selecciona una fecha de inicio*
                </label>
                <select
                    id="interestDate"
                    name="interestDate"
                    value={formData.interestDate}
                    onChange={handleChange}
                    className="mt-2 p-3 w-full border border-falu-red-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-falu-red-500"
                    required
                >
                    <option value="">Selecciona una fecha</option>
                    {availableDates.map(date => (
                        <option key={date.value} value={date.value}>
                            {date.label}
                        </option>
                    ))}
                </select>

            </div>
            {/* Nivel de inglés */}
            <div>
                <label htmlFor="englishLevel" className="block text-sm font-semibold text-zinc-700">
                    ¿A qué nivel de inglés te gustaría ingresar? *
                </label>
                <select
                    id="englishLevel"
                    name="englishLevel"
                    value={formData.englishLevel}
                    onChange={handleChange}
                    className="mt-2 p-3 w-full border border-falu-red-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-falu-red-500"
                    required
                >
                    <option value="">Selecciona tu nivel</option>
                    <option value="Principiante">Principiante (A1)</option>
                    <option value="Basico">Básico (A2)</option>
                    <option value="Intermedio">Intermedio (B1)</option>
                    { /* <option value="Intermedio alto">Intermedio alto (B2)</option> */}
                    { /* <option value="No seguro">No estoy segura/o</option> */}
                </select>
            </div>

            {/* Motivo para aprender inglés */}
            <div>
                <label htmlFor="motive" className="block text-sm font-semibold text-zinc-700">
                    ¿Cuál es tu principal motivo para aprender inglés? *
                </label>
                <select
                    id="motive"
                    name="motive"
                    value={formData.motive}
                    onChange={handleChange}
                    className="mt-2 p-3 w-full border border-falu-red-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-falu-red-500"
                    required
                >
                    <option value="">Selecciona un motivo</option>
                    <option value="Trabajo o mejores oportunidades laborales">
                        Trabajo o mejores oportunidades laborales
                    </option>
                    <option value="Estudios/Universidad">Estudios/Universidad</option>
                    <option value="Vivir en otro país">Vivir en otro país</option>
                    <option value="Viajar">Viajar</option>
                    <option value="Crecimiento personal y confianza">
                        Crecimiento personal y confianza
                    </option>
                    <option value="Otros">Otros</option>
                </select>
            </div>

            {/* Botón de enviar */}
            <div className="flex justify-center mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-falu-red-700 text-white rounded-xl text-sm font-semibold hover:bg-falu-red-800 transition disabled:opacity-50"
                >
                    {loading ? "Procesando..." : "Continuar"}
                </button>
            </div>
        </form>
    );
};

export default PaymentForm;
