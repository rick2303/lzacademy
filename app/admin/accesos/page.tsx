"use client";

import { useState } from "react";

const PLAN_DOT: Record<string, string> = {
    Essential:     "bg-blue-400",
    Premium:       "bg-violet-500",
    Personalizado: "bg-red-400",
    Speaking:      "bg-orange-400",
};

const LEVEL_LABEL: Record<string, string> = {
    "Principiante":               "Principiante · A1",
    "Basico":                     "Básico · A2",
    "Intermedio":                 "Intermedio · B1",
    "Intermedio alto-gramatica":  "Intermedio alto · B2.1",
    "Intermedio alto-produccion": "Intermedio alto · B2.2",
};

const MOCK_USERS = [
    { id: 1, full_name: "María González",  email: "maria@ejemplo.com",   plan: "Essential",     level: "Principiante",               country: "México",    inscription_date: "2025-04-01", access_sent: false },
    { id: 2, full_name: "Carlos Rodríguez",email: "carlos@ejemplo.com",  plan: "Premium",       level: "Intermedio",                  country: "Colombia",  inscription_date: "2025-04-03", access_sent: true  },
    { id: 3, full_name: "Lucía Martínez",  email: "lucia@ejemplo.com",   plan: "Personalizado", level: "Intermedio alto-gramatica",   country: "Argentina", inscription_date: "2025-04-05", access_sent: false },
    { id: 4, full_name: "Andrés Herrera",  email: "andres@ejemplo.com",  plan: "Essential",     level: "Basico",                      country: "Perú",      inscription_date: "2025-04-07", access_sent: false },
    { id: 5, full_name: "Sofía Reyes",     email: "sofia@ejemplo.com",   plan: "Speaking",      level: "Intermedio alto-produccion",  country: "Chile",     inscription_date: "2025-04-09", access_sent: true  },
];

function initials(name: string) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function Avatar({ name }: { name: string }) {
    return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-falu-red-500 to-yellow-orange-400 flex items-center justify-center font-bold text-white text-xs flex-shrink-0 select-none">
            {initials(name)}
        </div>
    );
}

export default function AccesosPage() {
    const [filter, setFilter] = useState<"all" | "pending" | "sent">("pending");

    const filtered = MOCK_USERS.filter(u => {
        if (filter === "pending") return !u.access_sent;
        if (filter === "sent")    return u.access_sent;
        return true;
    });

    const pendingCount = MOCK_USERS.filter(u => !u.access_sent).length;
    const sentCount    = MOCK_USERS.filter(u =>  u.access_sent).length;

    return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">

            {/* ── Work in progress banner ── */}
            <div className="flex items-center gap-3 px-4 py-3 mb-7 bg-gray-900 text-white rounded-2xl">
                <span className="flex-shrink-0 text-lg">🚧</span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">Still working on this</p>
                    <p className="text-xs text-gray-400 mt-0.5">Esta sección no está disponible por el momento. El envío de accesos se habilitará próximamente.</p>
                </div>
                <span className="flex-shrink-0 text-xs font-mono bg-gray-800 text-gray-400 px-2.5 py-1 rounded-lg border border-gray-700">
                    coming soon
                </span>
            </div>

            {/* ── Header ── */}
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Accesos</h1>
                <p className="text-sm text-gray-400 mt-1">Envío de códigos de acceso al classroom por nivel</p>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 opacity-60">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total usuarios</p>
                        <p className="text-2xl font-bold text-gray-800">{MOCK_USERS.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 flex items-center gap-4 opacity-60">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Pendientes</p>
                        <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 opacity-60">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Enviados</p>
                        <p className="text-2xl font-bold text-emerald-600">{sentCount}</p>
                    </div>
                </div>
            </div>

            {/* ── Filter tabs ── */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-5 opacity-60 pointer-events-none">
                {([["all", "Todos"], ["pending", "Pendientes"], ["sent", "Enviados"]] as const).map(([val, label]) => (
                    <button
                        key={val}
                        onClick={() => setFilter(val)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            filter === val
                                ? "bg-white text-gray-800 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden opacity-60">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">
                        {filter === "pending" ? "Usuarios sin acceso enviado" : filter === "sent" ? "Accesos enviados" : "Todos los usuarios"}
                    </h3>
                    <span className="text-xs text-gray-400">{filtered.length} registro{filtered.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Usuario", "Plan", "Nivel", "País", "Fecha inicio", "Estado", ""].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={u.full_name} />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{u.full_name}</p>
                                                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PLAN_DOT[u.plan] ?? "bg-gray-300"}`} />
                                            {u.plan}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">
                                        {LEVEL_LABEL[u.level] ?? u.level}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{u.country}</td>
                                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{u.inscription_date}</td>
                                    <td className="px-5 py-3.5">
                                        {u.access_sent ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                Enviado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                Pendiente
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            disabled
                                            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed select-none"
                                            title="Próximamente disponible"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                            Enviar acceso
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden flex flex-col divide-y divide-gray-50">
                    {filtered.map(u => (
                        <div key={u.id} className="p-4 flex items-start gap-3">
                            <Avatar name={u.full_name} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{u.full_name}</p>
                                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                    </div>
                                    {u.access_sent ? (
                                        <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Enviado
                                        </span>
                                    ) : (
                                        <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                            Pendiente
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                                        <span className={`w-1.5 h-1.5 rounded-full ${PLAN_DOT[u.plan] ?? "bg-gray-300"}`} />
                                        {u.plan}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                                        {LEVEL_LABEL[u.level] ?? u.level}
                                    </span>
                                </div>
                                <button
                                    disabled
                                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    Enviar acceso
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
