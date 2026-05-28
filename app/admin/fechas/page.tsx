"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ErrorState } from "../_utils/ErrorState";

interface StartDate {
    value: string;
    label: string;
    enabled: boolean;
    special?: boolean;
    excludedPlans?: string[];
}

interface PremiumSlot {
    id: string;
    datetime_pt: string;
    start_date: string;
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

function buildSlotLabel(datetimePt: string): string {
    const [datePart, timePart] = datetimePt.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [h, m] = timePart.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const timeStr = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
    const d = new Date(Date.UTC(year, month - 1, day));
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthShort = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${dayNames[d.getUTCDay()]} ${day} ${monthShort[month - 1]} ${year} · ${timeStr} PT`;
}

export default function FechasPage() {
    const router = useRouter();

    // Start dates
    const [dates, setDates]     = useState<StartDate[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saving, setSaving]   = useState(false);
    const [newDate, setNewDate] = useState("");
    const [error, setError]     = useState("");
    const [saved, setSaved]     = useState(false);

    // Premium slots
    const [slots, setSlots]             = useState<PremiumSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [savingSlots, setSavingSlots] = useState(false);
    const [newSlotDt, setNewSlotDt]     = useState("");
    const [newSlotStartDate, setNewSlotStartDate] = useState("");
    const [slotsError, setSlotsError]   = useState("");
    const [slotsSaved, setSlotsSaved]   = useState(false);

    const load = useCallback(async () => {
        setLoadError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }

            const token = session.access_token;
            const base  = process.env.NEXT_PUBLIC_BACKEND_URL;

            const [datesRes, slotsRes] = await Promise.all([
                fetch(`${base}/config/start-dates/all`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${base}/config/premium-slots/all`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (!datesRes.ok) throw new Error(`Error fechas (${datesRes.status})`);
            if (!slotsRes.ok) throw new Error(`Error horarios (${slotsRes.status})`);
            setDates(await datesRes.json());
            setSlots(await slotsRes.json());
        } catch (e) {
            setLoadError(e instanceof Error ? e.message : "Error de red");
        } finally {
            setLoading(false);
            setLoadingSlots(false);
        }
    }, [router]);

    useEffect(() => { load(); }, [load]);

    // ─── Start dates ───────────────────────────────────────────────
    async function saveDates(updatedDates: StartDate[]) {
        setSaving(true); setSaved(false); setError("");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push("/admin/login"); return; }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/config/start-dates`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ dates: updatedDates }),
        });
        if (res.ok) { setDates(updatedDates); setSaved(true); setTimeout(() => setSaved(false), 2500); }
        else setError("Error guardando los cambios. Intenta de nuevo.");
        setSaving(false);
    }

    function handleToggle(index: number) {
        saveDates(dates.map((d, i) => i === index ? { ...d, enabled: !d.enabled } : d));
    }
    function handleDelete(index: number) {
        saveDates(dates.filter((_, i) => i !== index));
    }
    function handleAdd() {
        if (!newDate) return;
        if (dates.some(d => d.value === newDate)) { setError("Esa fecha ya existe."); return; }
        const updated = [...dates, { value: newDate, label: buildLabel(newDate), enabled: true }]
            .sort((a, b) => a.value.localeCompare(b.value));
        setNewDate(""); setError("");
        saveDates(updated);
    }

    // ─── Premium slots ─────────────────────────────────────────────
    async function saveSlots(updatedSlots: PremiumSlot[]) {
        setSavingSlots(true); setSlotsSaved(false); setSlotsError("");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push("/admin/login"); return; }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/config/premium-slots`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ slots: updatedSlots }),
        });
        if (res.ok) { setSlots(updatedSlots); setSlotsSaved(true); setTimeout(() => setSlotsSaved(false), 2500); }
        else setSlotsError("Error guardando los horarios.");
        setSavingSlots(false);
    }

    function handleToggleSlot(index: number) {
        saveSlots(slots.map((s, i) => i === index ? { ...s, enabled: !s.enabled } : s));
    }
    function handleDeleteSlot(index: number) {
        saveSlots(slots.filter((_, i) => i !== index));
    }
    function handleAddSlot() {
        if (!newSlotDt || !newSlotStartDate) return;
        const targetDate = dates.find(d => d.value === newSlotStartDate);
        if (!targetDate || !targetDate.enabled || targetDate.value < today) {
            setSlotsError("Esa fecha de inicio está inactiva o ya pasó."); return;
        }
        if (slots.some(s => s.datetime_pt === newSlotDt && s.start_date === newSlotStartDate)) {
            setSlotsError("Ese horario ya existe para esa fecha de inicio."); return;
        }
        const updated = [
            ...slots,
            { id: crypto.randomUUID(), datetime_pt: newSlotDt, start_date: newSlotStartDate, enabled: true },
        ].sort((a, b) => a.start_date.localeCompare(b.start_date) || a.datetime_pt.localeCompare(b.datetime_pt));
        setNewSlotDt(""); setNewSlotStartDate(""); setSlotsError("");
        saveSlots(updated);
    }

    const today = new Date().toISOString().split("T")[0];
    const nowDT  = new Date().toISOString().slice(0, 16);

    if (loadError) return <ErrorState message={loadError} onRetry={load} />;

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
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Fechas</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Administra las fechas de inicio y los horarios disponibles para clases Premium.
                </p>
            </div>

            {/* ══ SECCIÓN 1: Fechas de inicio ══ */}
            <div className="mb-10">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">1</span>
                    Fechas de inicio
                </h2>

                {/* Agregar fecha */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
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
                            className="px-4 py-2 bg-yellow-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-yellow-orange-600 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
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

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
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
                        <div className="px-5 py-10 text-center text-gray-300 text-sm">No hay fechas configuradas. Agrega una arriba.</div>
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
                                            <button
                                                onClick={() => handleToggle(i)}
                                                disabled={saving}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                                    date.enabled ? "bg-emerald-500" : "bg-gray-200"
                                                }`}
                                            >
                                                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                                    date.enabled ? "translate-x-6" : "translate-x-1"
                                                }`} />
                                            </button>
                                            <span className={`text-xs font-medium w-16 ${date.enabled ? "text-emerald-600" : "text-gray-400"}`}>
                                                {date.enabled ? "Activa" : "Inactiva"}
                                            </span>

                                            {/* Toggle: Especial (para /pago-estudiantes) */}
                                            <button
                                                onClick={() => saveDates(dates.map((d, idx) => idx === i ? { ...d, special: !d.special } : d))}
                                                disabled={saving}
                                                title="Habilitar en /pago-estudiantes"
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                                    date.special ? "bg-violet-500" : "bg-gray-200"
                                                }`}
                                            >
                                                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                                    date.special ? "translate-x-6" : "translate-x-1"
                                                }`} />
                                            </button>
                                            <span className={`text-xs font-medium w-16 ${date.special ? "text-violet-600" : "text-gray-400"}`}>
                                                {date.special ? "Especial" : "Normal"}
                                            </span>

                                            {/* Toggles: excluir planes del form normal */}
                                            <div className="flex items-center gap-1">
                                                {["Essential", "Premium", "Personalizado"].map((p) => {
                                                    const excluded = date.excludedPlans?.includes(p) ?? false;
                                                    return (
                                                        <button
                                                            key={p}
                                                            disabled={saving}
                                                            title={excluded ? `Habilitar ${p}` : `Deshabilitar ${p}`}
                                                            onClick={() => {
                                                                const current = date.excludedPlans ?? [];
                                                                const next = excluded
                                                                    ? current.filter((x) => x !== p)
                                                                    : [...current, p];
                                                                saveDates(dates.map((d, idx) => idx === i ? { ...d, excludedPlans: next } : d));
                                                            }}
                                                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition disabled:opacity-50 ${excluded ? "bg-red-100 text-red-500 line-through" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                                                        >
                                                            {p === "Essential" ? "E" : p === "Premium" ? "P" : "C"}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                onClick={() => handleDelete(i)}
                                                disabled={saving}
                                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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
                <p className="text-xs text-gray-400 mt-3 px-1">
                    Las fechas <strong>activas</strong> aparecen en el formulario público de inscripción. Las marcadas como <strong className="text-violet-500">Especial</strong> se muestran en <code>/pago-estudiantes</code> para pagos especiales de estudiantes actuales. Las fechas pasadas se ocultan automáticamente.
                </p>
            </div>

            {/* ══ SECCIÓN 2: Horarios Premium ══ */}
            <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">2</span>
                    Horarios Premium
                </h2>

                {/* Agregar horario */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Agregar nuevo horario</p>
                    <p className="text-xs text-gray-400 mb-3">
                        Asocia un horario (en <strong>hora PT</strong>) a una fecha de inicio específica. El alumno verá solo los horarios de su fecha.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-xs text-gray-400 font-medium block mb-1">Fecha de inicio</label>
                            <select
                                value={newSlotStartDate}
                                onChange={(e) => { setNewSlotStartDate(e.target.value); setSlotsError(""); }}
                                className="w-full p-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50 appearance-none cursor-pointer"
                            >
                                <option value="">Selecciona fecha de inicio</option>
                                {dates.filter(d => d.enabled && d.value >= today).map(d => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-medium block mb-1">Hora de la clase (PT)</label>
                            <input
                                type="datetime-local"
                                min={nowDT}
                                value={newSlotDt}
                                onChange={(e) => { setNewSlotDt(e.target.value); setSlotsError(""); }}
                                className="w-full p-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                            />
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                        <div className="text-xs text-gray-400">
                            {newSlotDt && newSlotStartDate
                                ? <>Se mostrará a alumnos con inicio <span className="font-medium text-gray-600">{dates.find(d => d.value === newSlotStartDate)?.label ?? newSlotStartDate}</span> como: <span className="font-medium text-gray-600">{buildSlotLabel(newSlotDt)}</span></>
                                : <span className="text-gray-300">Selecciona fecha de inicio y hora para ver la vista previa</span>
                            }
                        </div>
                        <button
                            onClick={handleAddSlot}
                            disabled={!newSlotDt || !newSlotStartDate || savingSlots}
                            className="shrink-0 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Agregar
                        </button>
                    </div>
                </div>

                {slotsError && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{slotsError}</div>
                )}
                {slotsSaved && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Horarios guardados correctamente.
                    </div>
                )}

                {/* Lista de horarios */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">Horarios configurados</p>
                        <span className="text-xs text-gray-400">{slots.length} horarios</span>
                    </div>
                    {loadingSlots ? (
                        <div className="px-5 py-8 text-center text-gray-400 text-sm">Cargando…</div>
                    ) : slots.length === 0 ? (
                        <div className="px-5 py-10 text-center text-gray-300 text-sm">No hay horarios configurados. Agrega uno arriba.</div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {slots.map((slot, i) => {
                                const startDateLabel = dates.find(d => d.value === slot.start_date)?.label ?? slot.start_date;
                                return (
                                <li key={slot.id} className="flex items-center justify-between px-5 py-4 gap-4">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-purple-500 mb-0.5">Inicio: {startDateLabel}</p>
                                        <p className="text-sm font-semibold text-gray-800">{buildSlotLabel(slot.datetime_pt)}</p>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5">{slot.datetime_pt}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => handleToggleSlot(i)}
                                            disabled={savingSlots}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                                slot.enabled ? "bg-purple-500" : "bg-gray-200"
                                            }`}
                                        >
                                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                                slot.enabled ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                        </button>
                                        <span className={`text-xs font-medium w-16 ${slot.enabled ? "text-purple-600" : "text-gray-400"}`}>
                                            {slot.enabled ? "Activo" : "Inactivo"}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteSlot(i)}
                                            disabled={savingSlots}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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
                <p className="text-xs text-gray-400 mt-3 px-1">
                    Los horarios <strong>activos</strong> se muestran al alumno en la página de confirmación de pago Premium. Ingresa siempre en hora PT (Pacífico).
                </p>
            </div>
        </div>
    );
}
