"use client";

const ACCESOS_ENABLED = false;

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

interface AccessUser {
    id: number;
    email: string;
    full_name: string;
    plan: string;
    level: string;
    country: string;
    inscription_date: string | null;
    status: string;
    access_sent_at: string | null;
}

interface LevelConfig {
    whatsapp_link: string;
    classroom_link: string;
    classroom_code: string;
}

type AccessLinks = Record<string, Record<string, LevelConfig>>;

const LEVEL_LABELS: Record<string, string> = {
    "Principiante":               "A1",
    "Basico":                     "A2",
    "Intermedio":                 "B1",
    "Intermedio alto-gramatica":  "B2.1",
    "Intermedio alto-produccion": "B2.2",
};

const PLANS = ["Essential", "Premium", "Personalizado"];

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

const LEVELS = [
    "Principiante",
    "Basico",
    "Intermedio",
    "Intermedio alto-gramatica",
    "Intermedio alto-produccion",
];

export default function AccesosPage() {
    const [users, setUsers] = useState<AccessUser[]>([]);
    const [links, setLinks] = useState<AccessLinks>({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "sent">("pending");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sending, setSending] = useState<number | null>(null);
    const [toast, setToast] = useState<{ id: number; name: string; ok: boolean } | null>(null);
    const [showConfig, setShowConfig] = useState(false);
    const [configDraft, setConfigDraft] = useState<AccessLinks>({});
    const [savingConfig, setSavingConfig] = useState(false);
    const [configPlan, setConfigPlan] = useState("Essential");
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }
            const headers = { Authorization: `Bearer ${session.access_token}` };
            const base = process.env.NEXT_PUBLIC_BACKEND_URL;

            const [usersRes, configRes] = await Promise.all([
                fetch(`${base}/admin/accesos`, { headers }),
                fetch(`${base}/admin/accesos/config`, { headers }),
            ]);
            const [usersData, configData] = await Promise.all([usersRes.json(), configRes.json()]);
            setUsers(usersData);
            setLinks(configData);
            setConfigDraft(configData);
            setLoading(false);
        }
        load();
    }, []);

    const showToast = (id: number, name: string, ok: boolean) => {
        setToast({ id, name, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSend = async (user: AccessUser) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        setSending(user.id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/accesos/send/${user.id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, access_sent_at: new Date().toISOString() } : u));
                showToast(user.id, user.full_name, true);
            } else {
                showToast(user.id, user.full_name, false);
            }
        } catch {
            showToast(user.id, user.full_name, false);
        } finally {
            setSending(null);
        }
    };

    const handleToggleMark = async (user: AccessUser, sent: boolean) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/accesos/${user.id}/mark`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ sent }),
        });
        if (res.ok) {
            setUsers(prev => prev.map(u => u.id === user.id
                ? { ...u, access_sent_at: sent ? new Date().toISOString() : null }
                : u
            ));
        }
    };

    const handleSaveConfig = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        setSavingConfig(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/accesos/config`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
                body: JSON.stringify(configDraft),
            });
            setLinks(configDraft);
            setShowConfig(false);
        } finally {
            setSavingConfig(false);
        }
    };

    const filtered = users.filter(u => {
        if (filter === "pending" && u.access_sent_at) return false;
        if (filter === "sent" && !u.access_sent_at) return false;
        if (search) {
            const q = search.toLowerCase();
            if (!u.full_name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const PAGE_SIZE = 15;
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const pendingCount = users.filter(u => !u.access_sent_at).length;
    const sentCount    = users.filter(u => !!u.access_sent_at).length;

    useEffect(() => { setCurrentPage(1); }, [filter, search]);

    const levelConfigOk = (plan: string, level: string) => {
        const c = links[plan]?.[level];
        return !!(c?.whatsapp_link || c?.classroom_link);
    };

    if (!ACCESOS_ENABLED) return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Accesos</h1>
                <p className="text-sm text-gray-400 mt-1">Envío de accesos al classroom por nivel</p>
            </div>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 max-w-md">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <h2 className="text-base font-semibold text-amber-900 mb-2">Sección en preparación</h2>
                    <p className="text-sm text-amber-700 leading-relaxed">Esta sección estará disponible próximamente. Se están realizando ajustes finales antes de habilitar el envío de accesos.</p>
                </div>
            </div>
        </div>
    );

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
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium transition-all ${toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.ok
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    }
                    {toast.ok ? `Acceso enviado a ${toast.name}` : `Error al enviar acceso a ${toast.name}`}
                </div>
            )}

            {/* Config modal */}
            {showConfig && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowConfig(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-semibold text-gray-800 text-base">Links de acceso por nivel</h3>
                            <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        {/* Plan tabs */}
                        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
                            {PLANS.map(p => (
                                <button key={p} onClick={() => setConfigPlan(p)}
                                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${configPlan === p ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                                    {p}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            {LEVELS.map(level => {
                                const draft = configDraft[configPlan]?.[level] ?? { whatsapp_link: "", classroom_link: "", classroom_code: "" };
                                const levelLabel = LEVEL_LABELS[level] ?? level;
                                return (
                                    <div key={level} className="border border-gray-100 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-3">{LEVEL_LABEL[level] ?? level} <span className="text-xs font-normal text-gray-400 ml-1">({levelLabel})</span></p>
                                        <div className="flex flex-col gap-2">
                                            {[
                                                { key: "whatsapp_link", placeholder: `WhatsApp link ${configPlan} ${levelLabel}`, label: "WhatsApp" },
                                                { key: "classroom_link", placeholder: "Google Classroom link", label: "Classroom link" },
                                                { key: "classroom_code", placeholder: "Código (ej: jp42tnpb)", label: "Código" },
                                            ].map(({ key, placeholder, label: inputLabel }) => (
                                                <div key={key} className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400 w-28 flex-shrink-0">{inputLabel}</span>
                                                    <input
                                                        type="text"
                                                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                                                        placeholder={placeholder}
                                                        value={(draft as Record<string, string>)[key] ?? ""}
                                                        onChange={e => setConfigDraft(prev => ({
                                                            ...prev,
                                                            [configPlan]: {
                                                                ...prev[configPlan],
                                                                [level]: { ...draft, [key]: e.target.value },
                                                            },
                                                        }))}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-end gap-3 mt-5">
                            <button onClick={() => setShowConfig(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                                Cancelar
                            </button>
                            <button onClick={handleSaveConfig} disabled={savingConfig} className="px-4 py-2 text-sm font-medium bg-yellow-orange-500 text-white rounded-lg hover:bg-yellow-orange-600 transition disabled:opacity-60">
                                {savingConfig ? "Guardando…" : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-7">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Accesos</h1>
                    <p className="text-sm text-gray-400 mt-1">Envío de accesos al classroom por nivel</p>
                </div>
                <button
                    onClick={() => setShowConfig(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Configurar links
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total activos</p>
                        <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                    </div>
                </div>
                <div className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${pendingCount > 0 ? "border-amber-200" : "border-gray-100"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pendingCount > 0 ? "bg-amber-50 text-amber-500" : "bg-gray-50 text-gray-400"}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Pendientes</p>
                        <p className={`text-2xl font-bold ${pendingCount > 0 ? "text-amber-600" : "text-gray-800"}`}>{pendingCount}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Enviados</p>
                        <p className="text-2xl font-bold text-emerald-600">{sentCount}</p>
                    </div>
                </div>
            </div>

            {/* Alert if pending */}
            {pendingCount > 0 && filter !== "sent" && (
                <div className="flex items-center gap-3 px-4 py-3 mb-5 bg-amber-50 border border-amber-200 rounded-2xl">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                    <p className="text-sm text-amber-800 font-medium">{pendingCount} usuario{pendingCount > 1 ? "s" : ""} sin acceso enviado</p>
                </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por nombre o correo…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-5">
                {([["all", "Todos"], ["pending", "Pendientes"], ["sent", "Enviados"]] as const).map(([val, label]) => (
                    <button
                        key={val}
                        onClick={() => setFilter(val)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === val ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">
                        {filter === "pending" ? "Usuarios sin acceso enviado" : filter === "sent" ? "Accesos enviados" : "Todos los usuarios activos"}
                    </h3>
                    <span className="text-xs text-gray-400">
                        {filtered.length === 0 ? "Sin registros" : <><strong className="text-gray-600">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> de <strong className="text-gray-600">{filtered.length}</strong></>}
                    </span>
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
                            {paginated.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-gray-300 text-sm">Sin registros</td></tr>
                            ) : paginated.map(u => {
                                const configReady = levelConfigOk(u.plan, u.level);
                                const isSending = sending === u.id;
                                return (
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
                                        <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                                            {LEVEL_LABEL[u.level] ?? u.level}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500">{u.country}</td>
                                        <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                                            {u.inscription_date ? dayjs.utc(u.inscription_date).format("DD/MM/YYYY") : "—"}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {u.access_sent_at ? (
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        Enviado
                                                    </span>
                                                    <p className="text-xs text-gray-400 mt-1">{dayjs.utc(u.access_sent_at).format("DD/MM/YY")}</p>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {u.access_sent_at ? (
                                                <div className="flex flex-col gap-1.5">
                                                    <button
                                                        onClick={() => handleSend(u)}
                                                        disabled={isSending || !configReady}
                                                        className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        {isSending ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                                                            : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                        }
                                                        Reenviar
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleMark(u, false)}
                                                        className="text-xs text-gray-400 hover:text-red-500 transition text-left px-1"
                                                    >
                                                        Marcar como pendiente
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1.5">
                                                    <button
                                                        onClick={() => handleSend(u)}
                                                        disabled={isSending || !configReady}
                                                        className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-falu-red-600 text-white hover:bg-falu-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title={!configReady ? "Configura los links de este nivel primero" : ""}
                                                    >
                                                        {isSending
                                                            ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                                                            : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                                        }
                                                        {isSending ? "Enviando…" : "Enviar acceso"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleMark(u, true)}
                                                        className="text-xs text-gray-400 hover:text-emerald-600 transition text-left px-1"
                                                    >
                                                        Marcar como enviado
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="hidden md:flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-400">Pág. <strong className="text-gray-600">{currentPage}</strong> / <strong className="text-gray-600">{totalPages}</strong></p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-white transition">← Ant.</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-white transition">Sig. →</button>
                        </div>
                    </div>
                )}

                {/* Mobile */}
                <div className="md:hidden flex flex-col divide-y divide-gray-50">
                    {paginated.length === 0 ? (
                        <div className="p-8 text-center text-gray-300 text-sm">Sin registros</div>
                    ) : paginated.map(u => {
                        const configReady = levelConfigOk(u.plan, u.level);
                        const isSending = sending === u.id;
                        return (
                            <div key={u.id} className="p-4 flex items-start gap-3">
                                <Avatar name={u.full_name} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{u.full_name}</p>
                                            <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                        </div>
                                        {u.access_sent_at ? (
                                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Enviado
                                            </span>
                                        ) : (
                                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Pendiente
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                                            <span className={`w-1.5 h-1.5 rounded-full ${PLAN_DOT[u.plan] ?? "bg-gray-300"}`} />{u.plan}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">{LEVEL_LABEL[u.level] ?? u.level}</span>
                                    </div>
                                    <button
                                        onClick={() => handleSend(u)}
                                        disabled={isSending || !configReady}
                                        className={`mt-3 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed ${u.access_sent_at ? "border border-gray-200 text-gray-500 hover:bg-gray-50" : "bg-falu-red-600 text-white hover:bg-falu-red-700"}`}
                                    >
                                        {isSending
                                            ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                                            : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        }
                                        {isSending ? "Enviando…" : u.access_sent_at ? "Reenviar" : "Enviar acceso"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {totalPages > 1 && (
                    <div className="md:hidden flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-400">Pág. {currentPage} / {totalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 bg-white">← Ant.</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 bg-white">Sig. →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
