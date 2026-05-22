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
const fmtPT  = (ts: string | null, fmt = "DD MMM YYYY, h:mm a") => ts ? dayjs.utc(ts).tz(PT).format(fmt) : "—";
const fmtDate = (d: string | null) => d ? dayjs.utc(d).format("DD MMM YYYY") : "—";

const PLANS  = ["Essential", "Premium", "Personalizado", "Speaking"];
const LEVELS = [
    { value: "Principiante",              label: "Principiante · A1" },
    { value: "Basico",                    label: "Básico · A2" },
    { value: "Intermedio",                label: "Intermedio · B1" },
    { value: "Intermedio alto-gramatica", label: "Intermedio alto · B2.1" },
    { value: "Intermedio alto-produccion",label: "Intermedio alto · B2.2" },
];

const LEVEL_LABEL: Record<string, string> = Object.fromEntries(LEVELS.map(l => [l.value, l.label]));

const PLAN_CHIP: Record<string, { bg: string; text: string; dot: string }> = {
    Essential:     { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
    Premium:       { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
    Personalizado: { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400" },
    Speaking:      { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
};

const STATUS_CHIP: Record<string, { bg: string; text: string; dot: string }> = {
    active:    { bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-400" },
    inactive:  { bg: "bg-gray-100",    text: "text-gray-500",    dot: "bg-gray-300" },
    cancelled: { bg: "bg-red-50",      text: "text-red-600",     dot: "bg-red-400" },
};

function initials(name: string) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
    const s = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base" }[size];
    return (
        <div className={`${s} rounded-full bg-gradient-to-br from-falu-red-500 to-yellow-orange-400 flex items-center justify-center font-bold text-white flex-shrink-0 select-none`}>
            {initials(name) || "?"}
        </div>
    );
}

function PlanChip({ plan }: { plan: string }) {
    const c = PLAN_CHIP[plan];
    if (!c) return <span className="text-xs text-gray-400">{plan}</span>;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {plan}
        </span>
    );
}

function StatusChip({ status }: { status: string }) {
    const c = STATUS_CHIP[status] ?? STATUS_CHIP["inactive"];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
}

function CopyBadge({ value, label }: { value: string | null; label?: string }) {
    const [copied, setCopied] = useState(false);
    if (!value) return <span className="text-gray-300 text-xs">—</span>;
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 hover:border-gray-300 transition-all max-w-full cursor-pointer"
            title={value}
        >
            <span className="truncate">{label ?? value}</span>
            {copied
                ? <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <svg className="w-3 h-3 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            }
        </button>
    );
}

interface Payment {
    id: number; amount: number; payment_status: string;
    stripe_payment_intent_id: string | null;
    stripe_checkout_session_id: string | null;
    payment_date: string | null; created_at: string;
}
interface Interest {
    id: number; email: string; full_name: string;
    country: string; motive: string | null; created_at: string;
}
interface UserResult {
    id: number; email: string; full_name: string; country: string;
    plan: string; level: string; motive: string; status: string;
    inscription_date: string | null; last_payment_date: string | null;
    customer_stripe_id: string | null; created_at: string;
    notes: string | null;
    subscription_status: string | null;
    stripe_subscription_id: string | null;
    cancel_at_period_end: boolean | null;
    current_period_end: string | null;
    payments: Payment[]; interest: Interest[];
}

const SUB_STATUS_CHIP: Record<string, { bg: string; text: string; dot: string }> = {
    active:              { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
    trialing:            { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
    past_due:            { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
    canceled:            { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
    cancelled:           { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
    unpaid:              { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
    incomplete:          { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-300" },
    incomplete_expired:  { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-300" },
};

function SubStatusChip({ status }: { status: string | null }) {
    if (!status) return <span className="text-gray-300 text-xs">—</span>;
    const c = SUB_STATUS_CHIP[status] ?? { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-300" };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
}

// ── Field atom ──────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">{label}</p>
            <div className="text-sm text-gray-800">{children}</div>
        </div>
    );
}

// ── Page ────────────────────────────────────────────────
export default function BusquedaPage() {
    const [query, setQuery]     = useState("");
    const [results, setResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<UserResult | null>(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ plan: "", level: "", inscription_date: "", email: "" });
    const [saving, setSaving]   = useState(false);
    const [saved, setSaved]     = useState(false);
    const [notesDraft, setNotesDraft] = useState("");
    const [notesSaving, setNotesSaving] = useState(false);
    const [notesSaved, setNotesSaved] = useState(false);
    const [statusSaving, setStatusSaving] = useState(false);
    const [subBusy, setSubBusy] = useState<null | "cancel" | "refund" | "portal">(null);
    const [subMsg, setSubMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [portalUrl, setPortalUrl] = useState<string | null>(null);
    const [portalCopied, setPortalCopied] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef    = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) router.push("/admin/login");
        });
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (query.trim().length < 2) { setResults([]); setSelected(null); return; }
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/search?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            setResults(list);
            if (list.length === 1) openUser(list[0]);
            setLoading(false);
        }, 350);
    }, [query]);

    // ESC cancels edit
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && editing) setEditing(false); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [editing]);

    function openUser(user: UserResult) {
        setSelected(user);
        setEditForm({ plan: user.plan, level: user.level, inscription_date: user.inscription_date ?? "", email: user.email });
        setNotesDraft(user.notes ?? "");
        setEditing(false);
        setSaved(false);
        setNotesSaved(false);
        setSubMsg(null);
        setPortalUrl(null);
        setPortalCopied(false);
        setSubBusy(null);
    }

    async function refreshUser(id: number) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/search?q=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        const list: UserResult[] = Array.isArray(data) ? data : [];
        const fresh = list.find((u) => u.id === id);
        if (fresh) {
            setResults((prev) => prev.map((u) => (u.id === id ? fresh : u)));
            setSelected((prev) => (prev && prev.id === id ? fresh : prev));
        }
    }

    async function handleCancelSubscription(refund: boolean) {
        if (!selected) return;
        const ok = refund
            ? window.confirm("¿Reembolsar y cancelar la suscripción ahora? Esto emitirá un REEMBOLSO al cliente (garantía de 3 días) y cancelará la suscripción de inmediato. Esta acción no se puede deshacer.")
            : window.confirm("¿Programar la cancelación al fin del periodo actual? El usuario mantendrá el acceso hasta el final del periodo ya pagado.");
        if (!ok) return;
        setSubBusy(refund ? "refund" : "cancel");
        setSubMsg(null);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setSubBusy(null); return; }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${selected.id}/cancel-subscription`, {
                method: "POST",
                headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ refund }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data?.error || "No se pudo procesar la solicitud");
            setSubMsg({
                type: "success",
                text: data.mode === "refund_and_cancel"
                    ? "Reembolso emitido y suscripción cancelada correctamente."
                    : "Cancelación programada al fin del periodo correctamente.",
            });
            await refreshUser(selected.id);
        } catch (err) {
            setSubMsg({ type: "error", text: err instanceof Error ? err.message : "Ocurrió un error inesperado." });
        } finally {
            setSubBusy(null);
        }
    }

    async function handleBillingPortal() {
        if (!selected) return;
        setSubBusy("portal");
        setSubMsg(null);
        setPortalUrl(null);
        setPortalCopied(false);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setSubBusy(null); return; }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${selected.id}/billing-portal`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const data = await res.json();
            if (!res.ok || !data.url) throw new Error(data?.error || "No se pudo generar el link del portal");
            setPortalUrl(data.url);
        } catch (err) {
            setSubMsg({ type: "error", text: err instanceof Error ? err.message : "Ocurrió un error inesperado." });
        } finally {
            setSubBusy(null);
        }
    }

    async function handleStatusChange(newStatus: string) {
        if (!selected || selected.status === newStatus) return;
        setStatusSaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${selected.id}/status`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        setSelected(prev => prev ? { ...prev, status: newStatus } : prev);
        setResults(prev => prev.map(u => u.id === selected.id ? { ...u, status: newStatus } : u));
        setStatusSaving(false);
    }

    async function handleSaveNotes() {
        if (!selected) return;
        setNotesSaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${selected.id}/fields`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ notes: notesDraft }),
        });
        setSelected(prev => prev ? { ...prev, notes: notesDraft } : prev);
        setResults(prev => prev.map(u => u.id === selected.id ? { ...u, notes: notesDraft } : u));
        setNotesSaving(false);
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 3000);
    }

    async function handleSave() {
        if (!selected) return;
        setSaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const body: Record<string, string> = { plan: editForm.plan, level: editForm.level };
        if (editForm.inscription_date) body.inscription_date = editForm.inscription_date;
        if (editForm.email && editForm.email !== selected.email) body.email = editForm.email;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${selected.id}/fields`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const updated = { ...selected, ...body };
        setSelected(updated);
        setResults(prev => prev.map(u => u.id === selected.id ? { ...u, ...body } : u));
        setSaving(false);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    const totalPaid = selected
        ? selected.payments.filter(p => p.payment_status === "succeeded").reduce((s, p) => s + p.amount, 0)
        : 0;

    const hasResults = results.length > 0;
    const showEmpty  = query.trim().length >= 2 && !loading && !hasResults;

    return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">

            {/* ── Header ── */}
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Búsqueda</h1>
                <p className="text-sm text-gray-400 mt-1">Encuentra un usuario por nombre o correo electrónico</p>
            </div>

            {/* ── Search bar ── */}
            <div className="relative max-w-2xl mb-8">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    {loading
                        ? <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                        : <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                    }
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Nombre o correo electrónico…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 text-sm bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 focus:border-yellow-orange-300 transition-all placeholder:text-gray-400"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); setResults([]); setSelected(null); inputRef.current?.focus(); }}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>

            {/* ── Results layout ── */}
            {hasResults && (
                <div className="flex flex-col lg:flex-row gap-5 items-start">

                    {/* ── Results list ── */}
                    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-2">
                        <p className="text-xs text-gray-400 px-1 mb-1">
                            {results.length} resultado{results.length !== 1 ? "s" : ""}
                        </p>
                        {results.map(u => {
                            const isActive = selected?.id === u.id;
                            return (
                                <button
                                    key={u.id}
                                    onClick={() => openUser(u)}
                                    className={`w-full text-left rounded-2xl border p-3.5 transition-all duration-150 ${
                                        isActive
                                            ? "border-yellow-orange-300 bg-yellow-orange-50 shadow-sm ring-1 ring-yellow-orange-200"
                                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar name={u.full_name} size="sm" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{u.full_name}</p>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{u.email}</p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_CHIP[u.status]?.dot ?? "bg-gray-300"}`} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2.5 ml-11">
                                        <PlanChip plan={u.plan} />
                                        <span className="text-xs text-gray-400 truncate">{u.country}</span>
                                        {u.notes && (
                                            <span title="Tiene notas internas" className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path fillRule="evenodd" d="M2 16a2 2 0 002 2h12a2 2 0 002-2v-5a1 1 0 10-2 0v5H4V8a1 1 0 00-1-1H3a1 1 0 00-1 1v8z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Detail panel ── */}
                    {selected && (
                        <div className="flex-1 min-w-0 flex flex-col gap-4">

                            {/* Profile header */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Top accent */}
                                <div className="h-1 bg-gradient-to-r from-falu-red-500 via-red-400 to-yellow-orange-400" />

                                <div className="p-6">
                                    {/* Header row */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <Avatar name={selected.full_name} size="lg" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                                <div>
                                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{selected.full_name}</h2>
                                                    {editing ? (
                                                        <input
                                                            type="email"
                                                            value={editForm.email}
                                                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                            className="mt-1 text-sm border border-yellow-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-yellow-50 w-full max-w-xs"
                                                            placeholder="correo@ejemplo.com"
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-400 mt-0.5">{selected.email}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                    {/* Status buttons */}
                                                    <div className="flex items-center gap-1">
                                                        {statusSaving && <svg className="w-3 h-3 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
                                                        {(["active", "inactive", "cancelled"] as const).map((s) => {
                                                            const isActive = selected.status === s;
                                                            const styles: Record<string, string> = {
                                                                active:    isActive ? "bg-emerald-500 text-white border-emerald-500" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
                                                                inactive:  isActive ? "bg-gray-400 text-white border-gray-400"    : "text-gray-500 border-gray-200 hover:bg-gray-50",
                                                                cancelled: isActive ? "bg-red-500 text-white border-red-500"      : "text-red-500 border-red-200 hover:bg-red-50",
                                                            };
                                                            const labels: Record<string, string> = { active: "Activo", inactive: "Inactivo", cancelled: "Cancelado" };
                                                            return (
                                                                <button key={s} onClick={() => handleStatusChange(s)} disabled={statusSaving}
                                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer disabled:opacity-50 ${styles[s]}`}>
                                                                    {labels[s]}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {/* Edit / Save */}
                                                    {!editing ? (
                                                        <button
                                                            onClick={() => setEditing(true)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            Editar campos
                                                        </button>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setEditing(false)}
                                                                className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition cursor-pointer">
                                                                Cancelar
                                                            </button>
                                                            <button onClick={handleSave} disabled={saving}
                                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-falu-red-600 to-red-500 rounded-lg px-3.5 py-1.5 hover:opacity-90 transition disabled:opacity-50 shadow-sm cursor-pointer">
                                                                {saving
                                                                    ? <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Guardando…</>
                                                                    : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Guardar</>
                                                                }
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save confirmation */}
                                    {saved && (
                                        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-700">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Cambios guardados correctamente
                                        </div>
                                    )}

                                    {/* Edit hint */}
                                    {editing && (
                                        <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700">
                                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Editando campos · <kbd className="font-mono bg-yellow-100 px-1 rounded">Esc</kbd> para cancelar
                                        </div>
                                    )}

                                    {/* Info grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                                        <Field label="ID en BD">
                                            <span className="font-mono font-semibold text-gray-600">#{selected.id}</span>
                                        </Field>

                                        <Field label="País">
                                            <span className="font-medium">{selected.country}</span>
                                        </Field>

                                        <Field label="Registrado">
                                            <span className="text-gray-600">{fmtDate(selected.created_at)}</span>
                                        </Field>

                                        <Field label="Plan">
                                            {editing ? (
                                                <select value={editForm.plan} onChange={e => setEditForm({ ...editForm, plan: e.target.value })}
                                                    className="w-full text-sm border border-yellow-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-yellow-50 font-medium">
                                                    {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                                                </select>
                                            ) : (
                                                <PlanChip plan={selected.plan} />
                                            )}
                                        </Field>

                                        <Field label="Nivel">
                                            {editing ? (
                                                <select value={editForm.level} onChange={e => setEditForm({ ...editForm, level: e.target.value })}
                                                    className="w-full text-sm border border-yellow-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-yellow-50">
                                                    {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                                </select>
                                            ) : (
                                                <span className="font-medium">{LEVEL_LABEL[selected.level] ?? (selected.level || "—")}</span>
                                            )}
                                        </Field>

                                        <Field label="Fecha de inicio">
                                            {editing ? (
                                                <input type="date" value={editForm.inscription_date}
                                                    onChange={e => setEditForm({ ...editForm, inscription_date: e.target.value })}
                                                    className="w-full text-sm border border-yellow-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-yellow-50" />
                                            ) : (
                                                <span className="font-medium">{fmtDate(selected.inscription_date)}</span>
                                            )}
                                        </Field>

                                        <Field label="Último pago (PT)">
                                            <span className="text-gray-600">{fmtPT(selected.last_payment_date)}</span>
                                        </Field>

                                        <Field label="Motivo">
                                            <span className="text-gray-600 leading-snug">{selected.motive || "—"}</span>
                                        </Field>
                                    </div>

                                    {/* Stripe */}
                                    <div className="mt-6 pt-5 border-t border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Referencias Stripe</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 w-24 flex-shrink-0">Customer ID</span>
                                            <CopyBadge value={selected.customer_stripe_id} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Suscripción ── */}
                            {(selected.stripe_subscription_id || selected.subscription_status) && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <h3 className="text-sm font-semibold text-gray-700">Suscripción</h3>
                                    </div>
                                    <div className="p-6">
                                        {/* Info grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 mb-6">
                                            <Field label="Estado">
                                                <SubStatusChip status={selected.subscription_status} />
                                            </Field>
                                            <Field label="Cancela al fin del periodo">
                                                {selected.cancel_at_period_end ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                        Sí
                                                    </span>
                                                ) : (
                                                    <span className="font-medium text-gray-600">No</span>
                                                )}
                                            </Field>
                                            <Field label="Fin de periodo">
                                                <span className="text-gray-600">{fmtDate(selected.current_period_end)}</span>
                                            </Field>
                                            <Field label="Subscription ID">
                                                <CopyBadge value={selected.stripe_subscription_id} label={selected.stripe_subscription_id ? selected.stripe_subscription_id.slice(0, 18) + "…" : undefined} />
                                            </Field>
                                        </div>

                                        {/* Status message */}
                                        {subMsg && (
                                            <div className={`flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl text-xs font-medium ${subMsg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                                                {subMsg.type === "success"
                                                    ? <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    : <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                                                }
                                                {subMsg.text}
                                            </div>
                                        )}

                                        {/* Portal URL result */}
                                        {portalUrl && (
                                            <div className="mb-4 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                                                <p className="text-xs font-medium text-gray-500 mb-2">Link del portal de Stripe (envíalo al usuario):</p>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        readOnly
                                                        value={portalUrl}
                                                        onFocus={(e) => e.currentTarget.select()}
                                                        className="flex-1 min-w-0 font-mono text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-orange-300"
                                                    />
                                                    <button
                                                        onClick={() => { navigator.clipboard.writeText(portalUrl); setPortalCopied(true); setTimeout(() => setPortalCopied(false), 1500); }}
                                                        className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 bg-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer"
                                                    >
                                                        {portalCopied
                                                            ? <><svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copiado</>
                                                            : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copiar</>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                                            <button
                                                onClick={() => handleCancelSubscription(false)}
                                                disabled={subBusy !== null}
                                                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 bg-white rounded-lg px-3.5 py-2 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 cursor-pointer"
                                            >
                                                {subBusy === "cancel"
                                                    ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Procesando…</>
                                                    : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Cancelar al fin del periodo</>
                                                }
                                            </button>

                                            <button
                                                onClick={() => handleCancelSubscription(true)}
                                                disabled={subBusy !== null}
                                                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg px-3.5 py-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                                            >
                                                {subBusy === "refund"
                                                    ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Procesando…</>
                                                    : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>Reembolsar y cancelar (garantía 3 días)</>
                                                }
                                            </button>

                                            <button
                                                onClick={handleBillingPortal}
                                                disabled={subBusy !== null}
                                                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 bg-white rounded-lg px-3.5 py-2 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 cursor-pointer"
                                            >
                                                {subBusy === "portal"
                                                    ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Generando…</>
                                                    : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m6.5-1.328a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" /></svg>Generar link de portal de Stripe</>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Payment history ── */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                                    <h3 className="text-sm font-semibold text-gray-700">Historial de pagos</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400">{selected.payments.length} pago{selected.payments.length !== 1 ? "s" : ""}</span>
                                        {totalPaid > 0 && (
                                            <span className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                                                ${(totalPaid / 100).toFixed(2)} total
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {selected.payments.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        <p className="text-sm text-gray-300">Sin pagos registrados</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {["Fecha (PT)", "Monto", "Estado", "Payment Intent", "Session ID"].map(h => (
                                                        <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {selected.payments.map(p => (
                                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtPT(p.created_at)}</td>
                                                        <td className="px-5 py-3 text-sm font-bold text-gray-800">${(p.amount / 100).toFixed(2)}</td>
                                                        <td className="px-5 py-3">
                                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.payment_status === "succeeded" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${p.payment_status === "succeeded" ? "bg-emerald-400" : "bg-gray-300"}`} />
                                                                {p.payment_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3"><CopyBadge value={p.stripe_payment_intent_id} label={p.stripe_payment_intent_id ? p.stripe_payment_intent_id.slice(0, 18) + "…" : undefined} /></td>
                                                        <td className="px-5 py-3"><CopyBadge value={p.stripe_checkout_session_id} label={p.stripe_checkout_session_id ? p.stripe_checkout_session_id.slice(0, 18) + "…" : undefined} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* ── Interest submissions ── */}
                            {selected.interest.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                                        <h3 className="text-sm font-semibold text-gray-700">Formularios de interés</h3>
                                        <span className="text-xs text-gray-400">{selected.interest.length} formulario{selected.interest.length !== 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="flex flex-col divide-y divide-gray-50">
                                        {selected.interest.map(s => (
                                            <div key={s.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-gray-500">{fmtPT(s.created_at, "DD MMM YYYY, h:mm a")}</span>
                                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{s.country}</span>
                                                </div>
                                                {s.motive && <p className="text-sm text-gray-600 leading-relaxed">{s.motive}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Internal notes ── */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <h3 className="text-sm font-semibold text-gray-700">Notas internas</h3>
                                    </div>
                                    {notesSaved && (
                                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            Guardado
                                        </span>
                                    )}
                                </div>
                                <div className="p-6">
                                    <textarea
                                        value={notesDraft}
                                        onChange={e => setNotesDraft(e.target.value)}
                                        onBlur={handleSaveNotes}
                                        rows={4}
                                        placeholder="Agrega notas sobre este usuario (visible solo para el equipo)…"
                                        className="w-full text-sm text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 focus:border-yellow-orange-300 transition-all"
                                    />
                                    <div className="flex items-center justify-between mt-2.5">
                                        <p className="text-xs text-gray-300">Se guarda al perder el foco</p>
                                        <button
                                            onClick={handleSaveNotes}
                                            disabled={notesSaving}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-falu-red-600 to-red-500 rounded-lg px-3.5 py-1.5 hover:opacity-90 transition disabled:opacity-50 shadow-sm cursor-pointer"
                                        >
                                            {notesSaving
                                                ? <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Guardando…</>
                                                : <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Guardar</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Empty state ── */}
            {showEmpty && (
                <div className="max-w-sm mx-auto text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-500">Sin resultados</p>
                    <p className="text-xs text-gray-400 mt-1">No encontramos usuarios para <span className="font-medium text-gray-500">"{query}"</span></p>
                </div>
            )}

            {/* ── Initial hint ── */}
            {!hasResults && !showEmpty && query.trim().length === 0 && (
                <div className="max-w-sm mx-auto text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-400">Escribe el nombre o correo de un usuario</p>
                </div>
            )}
        </div>
    );
}
