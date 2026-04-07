"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const PT = "America/Los_Angeles";
const fmtPT = (ts: string | null, fmt = "MM/DD/YYYY h:mm a") =>
    ts ? dayjs.utc(ts).tz(PT).format(fmt) : "—";
const fmtDate = (d: string | null) => d ? dayjs.utc(d).format("MM/DD/YYYY") : "—";

const PLANS = ["Essential", "Premium", "Personalizado", "Speaking"];
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface Payment {
    id: number;
    amount: number;
    payment_status: string;
    stripe_payment_intent_id: string | null;
    stripe_checkout_session_id: string | null;
    payment_date: string | null;
    created_at: string;
}

interface Interest {
    id: number;
    email: string;
    full_name: string;
    country: string;
    motive: string | null;
    created_at: string;
}

interface UserResult {
    id: number;
    email: string;
    full_name: string;
    country: string;
    plan: string;
    level: string;
    motive: string;
    status: string;
    inscription_date: string | null;
    last_payment_date: string | null;
    customer_stripe_id: string | null;
    created_at: string;
    payments: Payment[];
    interest: Interest[];
}

const STATUS_STYLES: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-gray-100 text-gray-500",
    cancelled: "bg-red-100 text-red-600",
};

function CopyBadge({ value }: { value: string | null }) {
    const [copied, setCopied] = useState(false);
    if (!value) return <span className="text-gray-300 text-xs">—</span>;
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-100 transition flex items-center gap-1.5 max-w-full truncate"
            title={value}
        >
            <span className="truncate">{value}</span>
            {copied
                ? <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            }
        </button>
    );
}

export default function BusquedaPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<UserResult | null>(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ plan: "", level: "", inscription_date: "" });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) router.push("/admin/login");
        });
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (query.trim().length < 2) { setResults([]); return; }
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/search?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
            setLoading(false);
        }, 350);
    }, [query]);

    function openUser(user: UserResult) {
        setSelected(user);
        setEditForm({
            plan: user.plan,
            level: user.level,
            inscription_date: user.inscription_date ?? "",
        });
        setEditing(false);
        setSaveMsg("");
    }

    async function handleSave() {
        if (!selected) return;
        setSaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const body: Record<string, string> = { plan: editForm.plan, level: editForm.level };
        if (editForm.inscription_date) body.inscription_date = editForm.inscription_date;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${selected.id}/fields`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setSelected({ ...selected, ...body });
        setResults((prev) => prev.map((u) => u.id === selected.id ? { ...u, ...body } : u));
        setSaving(false);
        setEditing(false);
        setSaveMsg("Guardado correctamente");
        setTimeout(() => setSaveMsg(""), 3000);
    }

    const totalPaid = selected ? selected.payments.filter(p => p.payment_status === "succeeded").reduce((s, p) => s + p.amount, 0) : 0;

    return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Búsqueda</h1>
                <p className="text-sm text-gray-400 mt-1">Busca un usuario por nombre o correo electrónico</p>
            </div>

            {/* Search input */}
            <div className="relative mb-6 max-w-xl">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                {loading && (
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                )}
                <input
                    type="text"
                    placeholder="Nombre o correo electrónico…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 text-sm border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-white"
                    autoFocus
                />
            </div>

            {/* Results list + detail panel */}
            {results.length > 0 && (
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Left: result list */}
                    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-2">
                        {results.map((u) => (
                            <button
                                key={u.id}
                                onClick={() => openUser(u)}
                                className={`w-full text-left rounded-2xl border p-4 transition-all ${selected?.id === u.id ? "border-yellow-orange-400 bg-yellow-orange-50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"}`}
                            >
                                <p className="text-sm font-semibold text-gray-800 truncate">{u.full_name}</p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{u.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[u.status] ?? "bg-gray-100 text-gray-500"}`}>{u.status}</span>
                                    <span className="text-xs text-gray-400">{u.plan}</span>
                                    <span className="text-xs text-gray-300">·</span>
                                    <span className="text-xs text-gray-400">{u.country}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: detail panel */}
                    {selected && (
                        <div className="flex-1 min-w-0 flex flex-col gap-5">

                            {/* Profile card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-start justify-between gap-4 mb-5">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{selected.full_name}</h2>
                                        <p className="text-sm text-gray-400 mt-0.5">{selected.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[selected.status] ?? "bg-gray-100 text-gray-500"}`}>{selected.status}</span>
                                        {!editing ? (
                                            <button onClick={() => setEditing(true)} className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
                                                Editar
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditing(false)} className="text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">Cancelar</button>
                                                <button onClick={handleSave} disabled={saving} className="text-xs text-white bg-yellow-orange-500 hover:bg-yellow-orange-600 rounded-lg px-3 py-1.5 transition font-medium disabled:opacity-50">
                                                    {saving ? "Guardando…" : "Guardar"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {saveMsg && <p className="text-xs text-emerald-600 font-medium mb-4">{saveMsg}</p>}

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">ID en BD</p>
                                        <p className="text-sm font-mono font-semibold text-gray-700">#{selected.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">País</p>
                                        <p className="text-sm text-gray-700">{selected.country}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Registrado</p>
                                        <p className="text-sm text-gray-700">{fmtPT(selected.created_at, "MM/DD/YYYY")}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Plan</p>
                                        {editing ? (
                                            <select value={editForm.plan} onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50 w-full">
                                                {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-700">{selected.plan}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Nivel</p>
                                        {editing ? (
                                            <select value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50 w-full">
                                                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-700">{selected.level}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Fecha de inicio</p>
                                        {editing ? (
                                            <input type="date" value={editForm.inscription_date}
                                                onChange={(e) => setEditForm({ ...editForm, inscription_date: e.target.value })}
                                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50 w-full" />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-700">{fmtDate(selected.inscription_date)}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Último pago (PT)</p>
                                        <p className="text-sm text-gray-700">{fmtPT(selected.last_payment_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Motivo</p>
                                        <p className="text-sm text-gray-700 leading-snug">{selected.motive || "—"}</p>
                                    </div>
                                </div>

                                {/* Stripe IDs */}
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Referencias Stripe</p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 w-28 flex-shrink-0">Customer ID</span>
                                            <CopyBadge value={selected.customer_stripe_id} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payments */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                                    <h3 className="text-sm font-semibold text-gray-700">Historial de pagos</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400">{selected.payments.length} pago{selected.payments.length !== 1 ? "s" : ""}</span>
                                        <span className="text-sm font-bold text-gray-800">${(totalPaid / 100).toFixed(2)} total</span>
                                    </div>
                                </div>
                                {selected.payments.length === 0 ? (
                                    <p className="text-sm text-gray-300 text-center py-8">Sin pagos registrados</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {["Fecha (PT)", "Monto", "Estado", "Payment Intent", "Session ID"].map((h) => (
                                                        <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {selected.payments.map((p) => (
                                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtPT(p.created_at)}</td>
                                                        <td className="px-5 py-3 text-sm font-semibold text-gray-800">${(p.amount / 100).toFixed(2)}</td>
                                                        <td className="px-5 py-3">
                                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.payment_status === "succeeded" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                                                {p.payment_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3"><CopyBadge value={p.stripe_payment_intent_id} /></td>
                                                        <td className="px-5 py-3"><CopyBadge value={p.stripe_checkout_session_id} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Interest submissions */}
                            {selected.interest.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-50">
                                        <h3 className="text-sm font-semibold text-gray-700">Formularios de interés</h3>
                                    </div>
                                    <div className="flex flex-col divide-y divide-gray-50">
                                        {selected.interest.map((s) => (
                                            <div key={s.id} className="px-6 py-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-gray-400">{fmtPT(s.created_at, "MM/DD/YYYY h:mm a")}</span>
                                                    <span className="text-xs text-gray-500">{s.country}</span>
                                                </div>
                                                {s.motive && <p className="text-sm text-gray-600 leading-relaxed">{s.motive}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Empty state */}
            {query.trim().length >= 2 && !loading && results.length === 0 && (
                <div className="max-w-xl text-center py-12 text-gray-300">
                    <svg className="w-10 h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <p className="text-sm">Sin resultados para <strong className="text-gray-400">{query}</strong></p>
                </div>
            )}
        </div>
    );
}
