"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
function formatMonth(key: string) {
    const [year, month] = key.split("-");
    return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`;
}

const PLAN_COLORS: Record<string, string> = {
    Essential: "bg-blue-500",
    Premium: "bg-violet-500",
    Personalizado: "bg-emerald-500",
    Speaking: "bg-yellow-orange-500",
};
function planColor(p: string) { return PLAN_COLORS[p] ?? "bg-gray-400"; }

const STATUS_STYLES: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-gray-100 text-gray-500",
    cancelled: "bg-red-100 text-red-600",
};

interface User {
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
    created_at: string;
    updated_at: string;
}

interface DashboardData {
    totalUsers: number;
    totalPayments: number;
    totalRevenue: number;
    revenueByMonth: Record<string, { amount: number; count: number }>;
    paymentsByPlan: Record<string, { count: number; amount: number }>;
    users: User[];
}

const PAGE_SIZE = 15;
const STATUSES = ["active", "inactive", "cancelled"];

function StatCard({ label, value, sub, icon, accent = "text-falu-red-600", bg = "bg-falu-red-50" }: {
    label: string; value: string | number; sub?: string;
    icon: React.ReactNode; accent?: string; bg?: string;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${accent}`}>{icon}</div>
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [filters, setFilters] = useState({ country: "", status: "", inscriptionDate: "", paymentDate: "" });
    const [search, setSearch] = useState("");
    const [showAtRisk, setShowAtRisk] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/dashboard`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            setData(await res.json());
        }
        load();
    }, []);

    useEffect(() => { setCurrentPage(1); }, [filters, search, showAtRisk]);

    const handleStatusChange = async (userId: number, newStatus: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${userId}/status`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        setData((prev) => prev ? {
            ...prev,
            users: prev.users.map((u) => u.id === userId ? { ...u, status: newStatus } : u),
        } : prev);
    };

    const handleExportExcel = () => {
        if (!data) return;
        const rows = filteredUsers.map((u) => ({
            ID: u.id, Email: u.email, Nombre: u.full_name,
            "Fecha de Inicio": u.inscription_date ? dayjs.utc(u.inscription_date).format("DD/MM/YYYY") : "N/A",
            País: u.country, Plan: u.plan, Nivel: u.level, Motivo: u.motive, Estado: u.status,
            "Último Pago": u.last_payment_date ? dayjs.utc(u.last_payment_date).format("DD/MM/YYYY") : "N/A",
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
        saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }), "usuarios.xlsx");
    };

    if (!data) return (
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

    const atRiskUsers = data.users.filter((u) =>
        u.status === "active" && (!u.last_payment_date || dayjs().diff(dayjs.utc(u.last_payment_date), "day") > 30)
    );

    const filteredUsers = data.users.filter((u) => {
        if (filters.country && u.country !== filters.country) return false;
        if (filters.status && u.status !== filters.status) return false;
        if (filters.inscriptionDate && !u.inscription_date?.startsWith(filters.inscriptionDate)) return false;
        if (filters.paymentDate && !u.last_payment_date?.startsWith(filters.paymentDate)) return false;
        if (showAtRisk && !atRiskUsers.find((r) => r.id === u.id)) return false;
        if (search) {
            const q = search.toLowerCase();
            if (!u.full_name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const countries = Array.from(new Set(data.users.map((u) => u.country)));
    const statuses = Array.from(new Set(data.users.map((u) => u.status)));

    const monthlyRows = Object.entries(data.revenueByMonth ?? {}).sort((a, b) => b[0].localeCompare(a[0]));
    const planRows = Object.entries(data.paymentsByPlan ?? {}).sort((a, b) => b[1].count - a[1].count);
    const maxPlanCount = planRows[0]?.[1]?.count ?? 1;

    const ticketPromedio = data.totalPayments > 0 ? data.totalRevenue / data.totalPayments : 0;
    const hasActiveFilters = Object.values(filters).some(Boolean) || !!search || showAtRisk;

    return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
            {/* Header */}
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Pagos</h1>
                <p className="text-sm text-gray-400 mt-1">Resumen de pagos recibidos</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <StatCard label="Total usuarios" value={data.totalUsers}
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <StatCard label="Total pagos" value={data.totalPayments}
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
                <StatCard label="Total revenue" value={`$${(data.totalRevenue / 100).toFixed(2)}`}
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
                />
                <StatCard label="Ticket promedio" value={`$${(ticketPromedio / 100).toFixed(2)}`}
                    sub="por pago"
                    bg="bg-violet-50" accent="text-violet-600"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                />
            </div>

            {/* En riesgo banner */}
            {atRiskUsers.length > 0 && (
                <button
                    onClick={() => setShowAtRisk((v) => !v)}
                    className={`w-full mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
                        showAtRisk
                            ? "bg-amber-50 border-amber-300 text-amber-800"
                            : "bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-300"
                    }`}
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <div className="flex-1">
                        <span className="text-sm font-semibold">{atRiskUsers.length} usuario{atRiskUsers.length > 1 ? "s" : ""} activo{atRiskUsers.length > 1 ? "s" : ""} sin pago en más de 30 días</span>
                        <span className="text-xs ml-2 opacity-70">{showAtRisk ? "Clic para ver todos" : "Clic para filtrar"}</span>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${showAtRisk ? "bg-amber-200 text-amber-800" : "bg-amber-100 text-amber-700"}`}>
                        {showAtRisk ? "Viendo en riesgo" : "Ver en riesgo"}
                    </span>
                </button>
            )}

            {/* Plan breakdown + Monthly revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
                {planRows.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Pagos por plan</h3>
                        <div className="flex flex-col gap-3.5">
                            {planRows.map(([plan, stats]) => {
                                const pct = Math.round((stats.count / maxPlanCount) * 100);
                                return (
                                    <div key={plan}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${planColor(plan)}`} />
                                                <span className="text-sm font-medium text-gray-700">{plan}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="font-semibold text-gray-700">{stats.count} pagos</span>
                                                <span className="text-gray-400">${(stats.amount / 100).toFixed(0)}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className={`h-2 rounded-full transition-all duration-500 ${planColor(plan)}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {monthlyRows.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50">
                            <h3 className="text-sm font-semibold text-gray-700">Revenue por mes</h3>
                        </div>
                        <div className="overflow-y-auto max-h-64">
                            <table className="min-w-full">
                                <thead className="sticky top-0 bg-gray-50">
                                    <tr>
                                        <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mes</th>
                                        <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pagos</th>
                                        <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                                        <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">vs ant.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {monthlyRows.map(([month, stats], i) => {
                                        const prev = monthlyRows[i + 1]?.[1]?.amount;
                                        const change = prev && prev > 0 ? ((stats.amount - prev) / prev) * 100 : null;
                                        return (
                                            <tr key={month} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-2.5 text-sm font-medium text-gray-700">{formatMonth(month)}</td>
                                                <td className="px-5 py-2.5 text-sm text-gray-500">{stats.count}</td>
                                                <td className="px-5 py-2.5 text-sm font-semibold text-gray-800">${(stats.amount / 100).toFixed(2)}</td>
                                                <td className="px-5 py-2.5">
                                                    {change !== null ? (
                                                        <span className={`text-xs font-semibold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                                                            {change >= 0 ? "+" : ""}{change.toFixed(1)}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-300">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
                {/* Search */}
                <div className="relative mb-3">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                    />
                </div>
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 font-medium">País</label>
                        <select className="p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                            value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })}>
                            <option value="">Todos</option>
                            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 font-medium">Estado</label>
                        <select className="p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                            value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                            <option value="">Todos</option>
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 font-medium">Inscripción</label>
                        <input type="date" className="p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                            value={filters.inscriptionDate} onChange={(e) => setFilters({ ...filters, inscriptionDate: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 font-medium">Último pago</label>
                        <input type="date" className="p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                            value={filters.paymentDate} onChange={(e) => setFilters({ ...filters, paymentDate: e.target.value })} />
                    </div>
                    {hasActiveFilters && (
                        <button onClick={() => { setFilters({ country: "", status: "", inscriptionDate: "", paymentDate: "" }); setSearch(""); setShowAtRisk(false); }}
                            className="px-3 py-2 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                            Limpiar
                        </button>
                    )}
                    <div className="ml-auto">
                        <button onClick={handleExportExcel}
                            className="flex items-center gap-2 bg-yellow-orange-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-orange-600 transition shadow-sm text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 mb-3 px-1">
                {filteredUsers.length === 0 ? "Sin registros" : (
                    <><strong className="text-gray-600">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredUsers.length)}</strong> de <strong className="text-gray-600">{filteredUsers.length}</strong> registros</>
                )}
            </p>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                {["#", "Email", "Nombre", "Fecha inicio", "País", "Plan", "Estado", "Último pago", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedUsers.length === 0 ? (
                                <tr><td colSpan={9} className="text-center py-12 text-gray-300 text-sm">Sin registros</td></tr>
                            ) : paginatedUsers.map((u) => {
                                const isAtRisk = atRiskUsers.some((r) => r.id === u.id);
                                return (
                                    <tr key={u.id} className={`transition-colors ${isAtRisk ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-50"}`}>
                                        <td className="px-4 py-3 text-xs text-gray-400">{u.id}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 max-w-[160px] truncate">{u.email}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
                                            {isAtRisk && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 mb-0.5" />}
                                            {u.full_name}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                            {u.inscription_date ? dayjs.utc(u.inscription_date).format("DD/MM/YYYY") : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{u.country}</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                                <span className={`w-2 h-2 rounded-full ${planColor(u.plan)}`} />
                                                {u.plan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={u.status}
                                                onChange={(e) => handleStatusChange(u.id, e.target.value)}
                                                className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 ${STATUS_STYLES[u.status] ?? "bg-gray-100 text-gray-500"}`}
                                            >
                                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                            {u.last_payment_date ? dayjs.utc(u.last_payment_date).format("DD/MM/YYYY") : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-400">{u.level}</td>
                                    </tr>
                                );
                            })}
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
                {paginatedUsers.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-300 text-sm border border-gray-100">Sin registros</div>
                ) : paginatedUsers.map((u) => {
                    const isAtRisk = atRiskUsers.some((r) => r.id === u.id);
                    return (
                        <div key={u.id} className={`rounded-2xl shadow-sm border p-4 ${isAtRisk ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"}`}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {isAtRisk && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 mb-0.5" />}
                                        {u.full_name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                                </div>
                                <select
                                    value={u.status}
                                    onChange={(e) => handleStatusChange(u.id, e.target.value)}
                                    className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none ${STATUS_STYLES[u.status] ?? "bg-gray-100 text-gray-500"}`}
                                >
                                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-100">
                                    <span className={`w-2 h-2 rounded-full ${planColor(u.plan)}`} />
                                    {u.plan}
                                </span>
                                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-100">{u.country}</span>
                                {u.last_payment_date && (
                                    <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">
                                        Pago: {dayjs.utc(u.last_payment_date).format("DD/MM/YY")}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
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
        </div>
    );
}
