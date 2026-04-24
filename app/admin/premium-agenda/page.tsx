"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const PT = "America/Los_Angeles";
const fmt = (ts: string | null, f = "DD MMM YYYY, h:mm a") =>
    ts ? dayjs.utc(ts).tz(PT).format(f) : "—";
const fmtDate = (d: string | null) =>
    d ? dayjs.utc(d).format("DD MMM YYYY") : "—";

interface PremiumRow {
    payment_id: number;
    session_id: string;
    amount: number;
    payment_date: string;
    full_name: string;
    email: string;
    level: string;
    inscription_date: string | null;
    session_datetime?: string | null;
    cal_booking_uid?: string | null;
}

function StatCard({ label, value, sub, icon, accent = "text-violet-600", bg = "bg-violet-50" }: {
    label: string; value: string | number; sub?: string;
    icon: React.ReactNode; accent?: string; bg?: string;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow">
            <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${bg} flex items-center justify-center ${accent}`}>{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-tight">{label}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-0.5 truncate">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <button
            onClick={copy}
            title="Copiar enlace"
            className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-600 hover:bg-violet-100 transition border border-violet-100"
        >
            {copied ? (
                <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Copiado
                </>
            ) : (
                <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                    Copiar
                </>
            )}
        </button>
    );
}

export default function PremiumAgenda() {
    const router = useRouter();
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [pending, setPending]   = useState<PremiumRow[]>([]);
    const [booked, setBooked]     = useState<PremiumRow[]>([]);
    const [loading, setLoading]   = useState(true);
    const [tab, setTab]           = useState<"pending" | "booked">("pending");
    const [origin, setOrigin]     = useState("");

    useEffect(() => { setOrigin(window.location.origin); }, []);

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }
            const headers = { Authorization: `Bearer ${session.access_token}` };

            const [r1, r2] = await Promise.all([
                fetch(`${BACKEND}/admin/premium-sesiones`, { headers }),
                fetch(`${BACKEND}/admin/premium-sesiones-agendadas`, { headers }),
            ]);
            const [p, b] = await Promise.all([r1.json(), r2.json()]);
            setPending(Array.isArray(p) ? p : []);
            setBooked(Array.isArray(b) ? b : []);
            setLoading(false);
        }
        load();
    }, []);

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

    const total = pending.length + booked.length;

    return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
            {/* Header */}
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Premium · Agenda</h1>
                <p className="text-sm text-gray-400 mt-1">Seguimiento de clases Premium agendadas y pendientes</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard
                    label="Total Premium pagados"
                    value={total}
                    sub="este ciclo"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <StatCard
                    label="Sin agendar"
                    value={pending.length}
                    sub={pending.length > 0 ? "requieren atención" : "todo al día"}
                    bg={pending.length > 0 ? "bg-amber-50" : "bg-emerald-50"}
                    accent={pending.length > 0 ? "text-amber-600" : "text-emerald-600"}
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    label="Agendados"
                    value={booked.length}
                    sub={total > 0 ? `${Math.round((booked.length / total) * 100)}% completado` : "—"}
                    bg="bg-emerald-50"
                    accent="text-emerald-600"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            {/* Alert banner if pending > 0 */}
            {pending.length > 0 && (
                <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="text-sm font-medium">
                        {pending.length} usuario{pending.length > 1 ? "s" : ""} Premium {pending.length > 1 ? "aún no han agendado" : "aún no ha agendado"} su clase.
                        Puedes copiar su enlace de agendamiento y enviárselo.
                    </p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
                {(["pending", "booked"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            tab === t
                                ? "bg-white shadow-sm text-gray-800"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {t === "pending" ? "Sin agendar" : "Agendados"}
                        <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                            t === "pending"
                                ? pending.length > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-400"
                                : "bg-emerald-100 text-emerald-700"
                        }`}>
                            {t === "pending" ? pending.length : booked.length}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Pending tab ── */}
            {tab === "pending" && (
                <>
                    {pending.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Todo al día</p>
                            <p className="text-xs text-gray-400 mt-1">Todos los usuarios Premium han agendado su clase.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {["Nombre", "Email", "Nivel", "Inicio", "Pago", "Monto", "Enlace de agendamiento"].map((h) => (
                                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {pending.map((row) => {
                                                const link = `${origin}/success?session_id=${row.session_id}`;
                                                return (
                                                    <tr key={row.payment_id} className="hover:bg-amber-50 transition-colors">
                                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{row.full_name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">{row.email}</td>
                                                        <td className="px-4 py-3 text-xs text-gray-500">{row.level || "—"}</td>
                                                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(row.inscription_date)}</td>
                                                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmt(row.payment_date, "DD MMM YYYY")}</td>
                                                        <td className="px-4 py-3 text-xs font-semibold text-gray-700">${(row.amount / 100).toFixed(0)}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-xs text-gray-400 font-mono truncate max-w-[160px]">/success?session_id=…</span>
                                                                <CopyButton text={link} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="md:hidden flex flex-col gap-3">
                                {pending.map((row) => {
                                    const link = `${origin}/success?session_id=${row.session_id}`;
                                    return (
                                        <div key={row.payment_id} className="bg-white rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{row.full_name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{row.email}</p>
                                                </div>
                                                <span className="flex-shrink-0 text-xs font-bold text-gray-700">${(row.amount / 100).toFixed(0)}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {row.level && <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-100">{row.level}</span>}
                                                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">Inicio: {fmtDate(row.inscription_date)}</span>
                                                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">Pago: {fmt(row.payment_date, "DD MMM YYYY")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">Enlace de agendamiento:</span>
                                                <CopyButton text={link} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* ── Booked tab ── */}
            {tab === "booked" && (
                <>
                    {booked.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <p className="text-sm text-gray-400">Ningún usuario ha agendado todavía.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {["Nombre", "Email", "Nivel", "Inicio", "Clase agendada", "Cal UID", "Monto"].map((h) => (
                                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {booked.map((row) => (
                                                <tr key={row.payment_id} className="hover:bg-emerald-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{row.full_name}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">{row.email}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-500">{row.level || "—"}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(row.inscription_date)}</td>
                                                    <td className="px-4 py-3">
                                                        {row.session_datetime ? (
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg whitespace-nowrap">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                                {fmt(row.session_datetime)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-300">Sin datos</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-400 font-mono max-w-[120px] truncate">{row.cal_booking_uid || "—"}</td>
                                                    <td className="px-4 py-3 text-xs font-semibold text-gray-700">${(row.amount / 100).toFixed(0)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="md:hidden flex flex-col gap-3">
                                {booked.map((row) => (
                                    <div key={row.payment_id} className="bg-white rounded-2xl border border-gray-100 p-4">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{row.full_name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{row.email}</p>
                                            </div>
                                            <span className="flex-shrink-0 text-xs font-bold text-gray-700">${(row.amount / 100).toFixed(0)}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {row.level && <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{row.level}</span>}
                                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">Inicio: {fmtDate(row.inscription_date)}</span>
                                        </div>
                                        {row.session_datetime && (
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                {fmt(row.session_datetime)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
