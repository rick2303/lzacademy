"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { planColor } from "../_utils/planColors";
import { ErrorState } from "../_utils/ErrorState";
dayjs.extend(utc);

interface NoRenewUser {
    id: number;
    email: string;
    full_name: string;
    country: string;
    plan: string;
    level: string;
    subscription_status: string | null;
    cancel_at_period_end: boolean | null;
    current_period_end: string | null;
    last_payment_date: string | null;
}

const STATUS_CHIP: Record<string, { bg: string; text: string; dot: string }> = {
    active:              { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
    trialing:            { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
    past_due:            { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
    canceled:            { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
    cancelled:           { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
    unpaid:              { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
    incomplete:          { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-300" },
    incomplete_expired:  { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-300" },
};

function StatusBadge({ status }: { status: string | null }) {
    if (!status) return <span className="text-gray-300 text-xs">—</span>;
    const c = STATUS_CHIP[status] ?? { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-300" };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
}

const PAGE_SIZE = 15;
const PLANS = ["Essential", "Premium", "Personalizado", "Speaking"];
const fmtDate = (d: string | null) => (d ? dayjs.utc(d).format("DD/MM/YYYY") : "—");

export default function NoRenovadosPage() {
    const [users, setUsers] = useState<NoRenewUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [loadError, setLoadError] = useState<string | null>(null);
    const router = useRouter();

    const loadData = useCallback(async () => {
        setLoadError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/no-renovados`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (!response.ok) throw new Error(`Error del servidor (${response.status})`);
            const result = await response.json();
            if (Array.isArray(result)) setUsers(result);
        } catch (e) {
            setLoadError(e instanceof Error ? e.message : "Error de red");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { loadData(); }, [loadData]);

    if (loadError) return <ErrorState message={loadError} onRetry={loadData} />;

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

    const flaggedCount = users.filter((u) => u.cancel_at_period_end).length;

    const filtered = users
        .filter((u) => {
            const q = search.toLowerCase();
            const matchSearch = !q || (u.full_name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q);
            const matchPlan = planFilter === "all" || u.plan === planFilter;
            return matchSearch && matchPlan;
        })
        .sort((a, b) => {
            const ta = a.current_period_end ? new Date(a.current_period_end).getTime() : 0;
            const tb = b.current_period_end ? new Date(b.current_period_end).getTime() : 0;
            return ta - tb;
        });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function resetPage() { setCurrentPage(1); }

    function exportCSV() {
        const headers = ["Nombre", "Email", "País", "Plan", "Nivel", "Estado", "Cancela al final", "Fin de periodo", "Último pago"];
        const rows = filtered.map((u) => [
            u.full_name,
            u.email,
            u.country,
            u.plan,
            u.level,
            u.subscription_status ?? "",
            u.cancel_at_period_end ? "Sí" : "No",
            u.current_period_end ? dayjs.utc(u.current_period_end).format("YYYY-MM-DD") : "",
            u.last_payment_date ? dayjs.utc(u.last_payment_date).format("YYYY-MM-DD") : "",
        ]);
        const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `no_renovados_${dayjs().format("YYYY-MM-DD")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-7 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">No renovados</h1>
                    <p className="text-sm text-gray-400 mt-1">Suscriptores que cancelaron o no renovaron su suscripción</p>
                </div>
                {filtered.length > 0 && (
                    <button
                        onClick={exportCSV}
                        className="flex-shrink-0 inline-flex items-center gap-2 text-xs font-semibold text-gray-600 border border-gray-200 bg-white rounded-xl px-4 py-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exportar CSV
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-tight">No renovados</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-0.5">{users.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-tight">Cancelan al fin del periodo</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-0.5">{flaggedCount}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Nombre o email…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 focus:border-yellow-orange-300 transition-all"
                    />
                </div>

                {/* Plan pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button onClick={() => { setPlanFilter("all"); resetPage(); }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${planFilter === "all" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                        Todos
                    </button>
                    {PLANS.map((p) => (
                        <button key={p} onClick={() => { setPlanFilter(p); resetPage(); }}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${planFilter === p ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length > 0 && (
                <p className="text-xs text-gray-400 mb-3 px-1">
                    <strong className="text-gray-600">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> de <strong className="text-gray-600">{filtered.length}</strong> registros
                    {(search || planFilter !== "all") && <span className="ml-1 text-yellow-orange-500">(filtrado)</span>}
                </p>
            )}

            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-400">
                        {users.length === 0 ? "No hay suscriptores no renovados por el momento." : "Sin resultados para los filtros aplicados."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {["Nombre", "Email", "País", "Plan", "Nivel", "Estado", "Fin de periodo", "Último pago"].map((h) => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginated.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{u.full_name}</td>
                                            <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                                            <td className="px-5 py-3 text-sm text-gray-600">{u.country}</td>
                                            <td className="px-5 py-3">
                                                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                                    <span className={`w-2 h-2 rounded-full ${planColor(u.plan)}`} />
                                                    {u.plan}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-gray-600">{u.level || "—"}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <StatusBadge status={u.subscription_status} />
                                                    {u.cancel_at_period_end && (
                                                        <span title="Programada para cancelarse al fin del periodo" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                                                            Fin de periodo
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-xs text-gray-400">{fmtDate(u.current_period_end)}</td>
                                            <td className="px-5 py-3 text-xs text-gray-400">{fmtDate(u.last_payment_date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                                <p className="text-xs text-gray-400">Pág. <strong className="text-gray-600">{currentPage}</strong> / <strong className="text-gray-600">{totalPages}</strong></p>
                                <div className="flex gap-2">
                                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-white transition">← Ant.</button>
                                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-white transition">Sig. →</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden flex flex-col gap-3">
                        {paginated.map((u) => (
                            <div key={u.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{u.full_name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                                    </div>
                                    <StatusBadge status={u.subscription_status} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                                            <span className={`w-2 h-2 rounded-full ${planColor(u.plan)}`} />
                                            {u.plan}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{u.country}</span>
                                    </div>
                                    {u.cancel_at_period_end && (
                                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Fin de periodo</span>
                                    )}
                                </div>
                                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                                    <span>Fin: {fmtDate(u.current_period_end)}</span>
                                    <span>·</span>
                                    <span>Último pago: {fmtDate(u.last_payment_date)}</span>
                                </div>
                            </div>
                        ))}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center py-2 px-1">
                                <p className="text-xs text-gray-400">Pág. {currentPage} / {totalPages}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 bg-white hover:bg-gray-50 transition">← Ant.</button>
                                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 bg-white hover:bg-gray-50 transition">Sig. →</button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
