"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface StartDate {
    value: string;
    label: string;
    enabled: boolean;
}

const MONTH_NAMES_ES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function buildLabel(value: string) {
    const [year, month, day] = value.split("-");
    return `${parseInt(day, 10)} de ${MONTH_NAMES_ES[parseInt(month, 10) - 1]} de ${year}`;
}

function formatMMDDYYYY(value: string) {
    const [year, month, day] = value.split("-");
    return `${month}/${day}/${year}`;
}

export default function FechasPage() {
    const [dates, setDates] = useState<StartDate[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/config/start-dates/all`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (!res.ok) { setLoading(false); return; }
            setDates(await res.json());
            setLoading(false);
        }
        load();
    }, []);

    async function save(updatedDates: StartDate[]) {
        setSaving(true);
        setSaved(false);
        setError("");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push("/admin/login"); return; }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/config/start-dates`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ dates: updatedDates }),
        });

        if (res.ok) {
            setDates(updatedDates);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } else {
            setError("Error guardando los cambios. Intenta de nuevo.");
        }
        setSaving(false);
    }

    function handleToggle(index: number) {
        const updated = dates.map((d, i) =>
            i === index ? { ...d, enabled: !d.enabled } : d
        );
        save(updated);
    }

    function handleDelete(index: number) {
        const updated = dates.filter((_, i) => i !== index);
        save(updated);
    }

    function handleAdd() {
        if (!newDate) return;
        if (dates.some((d) => d.value === newDate)) {
            setError("Esa fecha ya existe.");
            return;
        }
        const updated = [
            ...dates,
            { value: newDate, label: buildLabel(newDate), enabled: true },
        ].sort((a, b) => a.value.localeCompare(b.value));
        setNewDate("");
        setError("");
        save(updated);
    }

    const today = new Date().toISOString().split("T")[0];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-gray-400">
                <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-sm">Cargando…</span>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Fechas de inicio</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Administra las fechas disponibles para el formulario de inscripción y las páginas del sitio.
                </p>
            </div>

            {/* Agregar fecha */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Agregar nueva fecha</p>
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 font-medium block mb-1">Fecha</label>
                        <input
                            type="date"
                            min={today}
                            value={newDate}
                            onChange={(e) => { setNewDate(e.target.value); setError(""); }}
                            className="w-full p-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={!newDate || saving}
                        className="px-4 py-2 bg-falu-red-700 text-white text-sm font-semibold rounded-xl hover:bg-falu-red-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Agregar
                    </button>
                </div>
                {newDate && (
                    <p className="text-xs text-gray-400 mt-2">
                        Se mostrará como: <span className="font-medium text-gray-600">{buildLabel(newDate)}</span>
                    </p>
                )}
            </div>

            {/* Feedback */}
            {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {error}
                </div>
            )}
            {saved && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Cambios guardados correctamente.
                </div>
            )}

            {/* Lista de fechas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Fechas configuradas</p>
                    <span className="text-xs text-gray-400">{dates.length} fechas</span>
                </div>

                {dates.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-300 text-sm">
                        No hay fechas configuradas. Agrega una arriba.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {dates.map((date, i) => {
                            const isPast = date.value < today;
                            return (
                                <li key={date.value} className={`flex items-center justify-between px-5 py-4 gap-4 ${isPast ? "opacity-50" : ""}`}>
                                    <div className="flex items-center gap-3 min-w-0">
                                        {isPast && (
                                            <span className="shrink-0 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-lg">Pasada</span>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{date.label}</p>
                                            <p className="text-xs text-gray-400">{formatMMDDYYYY(date.value)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        {/* Toggle */}
                                        <button
                                            onClick={() => handleToggle(i)}
                                            disabled={saving}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                                date.enabled ? "bg-emerald-500" : "bg-gray-200"
                                            }`}
                                            title={date.enabled ? "Deshabilitar" : "Habilitar"}
                                        >
                                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                                date.enabled ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                        </button>
                                        <span className={`text-xs font-medium w-16 ${date.enabled ? "text-emerald-600" : "text-gray-400"}`}>
                                            {date.enabled ? "Activa" : "Inactiva"}
                                        </span>
                                        {/* Eliminar */}
                                        <button
                                            onClick={() => handleDelete(i)}
                                            disabled={saving}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                            title="Eliminar"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <p className="text-xs text-gray-400 mt-4 px-1">
                Las fechas <strong>activas</strong> aparecen en el formulario de inscripción y en el sitio. Las <strong>inactivas</strong> quedan guardadas pero no se muestran. Las fechas pasadas se ocultan automáticamente al usuario.
            </p>
        </div>
    );
}
