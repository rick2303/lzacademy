"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface RecurringUser {
    email: string;
    full_name: string;
    country: string;
    plan: string;
    payment_count: number;
    total_paid: number;
    first_payment: string;
    last_payment: string;
}

const PLAN_COLORS: Record<string, string> = {
    Essential: "bg-blue-500",
    Premium: "bg-violet-500",
    Personalizado: "bg-emerald-500",
    Speaking: "bg-yellow-orange-500",
};
function planColor(plan: string) {
    return PLAN_COLORS[plan] ?? "bg-gray-400";
}

const PAGE_SIZE = 15;
const PLANS = ["Essential", "Premium", "Personalizado", "Speaking"];

export default function RecurrentesPage() {
    const [users, setUsers] = useState<RecurringUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [sortBy, setSortBy] = useState<"payment_count" | "total_paid" | "last_payment">("payment_count");
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/recurrentes`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const result = await response.json();
            if (Array.isArray(result)) setUsers(result);
            setLoading(false);
        }
        loadData();
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

    const totalRevenue = users.reduce((sum, u) => sum + u.total_paid, 0);
    const totalPayments = users.reduce((sum, u) => sum + u.payment_count, 0);

    const filtered = users
        .filter((u) => {
            const q = search.toLowerCase();
            const matchSearch = !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
            const matchPlan = planFilter === "all" || u.plan === planFilter;
            return matchSearch && matchPlan;
        })
        .sort((a, b) => {
            if (sortBy === "total_paid") return b.total_paid - a.total_paid;
            if (sortBy === "last_payment") return new Date(b.last_payment).getTime() - new Date(a.last_payment).getTime();
            return b.payment_count - a.payment_count;
        });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function resetPage() { setCurrentPage(1); }

    function exportCSV() {
        const headers = ["Nombre", "Email", "País", "Plan", "Pagos", "Total pagado (USD)", "Primer pago", "Último pago"];
        const rows = filtered.map((u) => [
            u.full_name,
            u.email,
            u.country,
            u.plan,
            u.payment_count,
            (u.total_paid / 100).toFixed(2),
            dayjs.utc(u.first_payment).format("YYYY-MM-DD"),
            dayjs.utc(u.last_payment).format("YYYY-MM-DD"),
        ]);
        const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `recurrentes_${dayjs().format("YYYY-MM-DD")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-7 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Usuarios Recurrentes</h1>
                    <p className="text-sm text-gray-400 mt-1">Usuarios con más de un pago registrado</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-tight">Usuarios recurrentes</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-0.5">{users.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-tight">Pagos totales</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-0.5">{totalPayments}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-tight">Revenue recurrentes</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-0.5 truncate">${(totalRevenue / 100).toFixed(2)}</p>
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

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value as typeof sortBy); resetPage(); }}
                    className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 text-gray-600"
                >
                    <option value="payment_count">Más pagos</option>
                    <option value="total_paid">Mayor LTV</option>
                    <option value="last_payment">Último pago</option>
                </select>
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
                        {users.length === 0 ? "No hay usuarios con más de un pago registrado aún." : "Sin resultados para los filtros aplicados."}
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
                                        {["Nombre", "Email", "País", "Plan", "Pagos", "Total pagado", "Primer pago", "Último pago"].map((h) => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginated.map((u) => (
                                        <tr key={u.email} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{u.full_name}</td>
                                            <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                                            <td className="px-5 py-3 text-sm text-gray-600">{u.country}</td>
                                            <td className="px-5 py-3">
                                                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                                    <span className={`w-2 h-2 rounded-full ${planColor(u.plan)}`} />
                                                    {u.plan}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-orange-100 text-yellow-orange-700">
                                                    {u.payment_count}×
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-sm font-bold text-gray-800">${(u.total_paid / 100).toFixed(2)}</td>
                                            <td className="px-5 py-3 text-xs text-gray-400">{dayjs.utc(u.first_payment).format("DD/MM/YYYY")}</td>
                                            <td className="px-5 py-3 text-xs text-gray-400">{dayjs.utc(u.last_payment).format("DD/MM/YYYY")}</td>
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
                            <div key={u.email} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{u.full_name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                                    </div>
                                    <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-orange-100 text-yellow-orange-700">
                                        {u.payment_count}×
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                                            <span className={`w-2 h-2 rounded-full ${planColor(u.plan)}`} />
                                            {u.plan}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{u.country}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">${(u.total_paid / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                                    <span>Desde: {dayjs.utc(u.first_payment).format("DD/MM/YY")}</span>
                                    <span>·</span>
                                    <span>Último: {dayjs.utc(u.last_payment).format("DD/MM/YY")}</span>
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
