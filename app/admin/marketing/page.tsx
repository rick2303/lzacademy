"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const PT = "America/Los_Angeles";

// ── Types ──────────────────────────────────────────────
interface CountryRow  { country: string; leads: number; paid: number; rate: number | null; }
interface MotiveRow   { motive: string; count: number; }
interface MarketingData {
    conversionByCountry: CountryRow[];
    motiveFrequency: MotiveRow[];
    totalLeads: number;
    totalPaid: number;
}
interface InterestSubmission {
    id: string;
    created_at: string;
    email: string;
    full_name: string;
    country: string;
    english_level: string;
    motive: string;
    main_difficulty: string;
    daily_routine: string;
    daily_time: string;
    community: string;
    interested_course: string | null;
    why_community: string | null;
    life_change: string | null;
    additional_info: string | null;
}

const PAGE_SIZE = 15;

const TABLE_HEADERS = [
    { label: "Fecha (PT)", key: "created_at" },
    { label: "Nombre",     key: "full_name" },
    { label: "Email",      key: "email" },
    { label: "País",       key: "country" },
    { label: "Nivel",      key: "english_level" },
    { label: "Motivo",     key: "motive" },
    { label: "Dificultad", key: "main_difficulty" },
    { label: "Rutina diaria",    key: "daily_routine" },
    { label: "Tiempo/día",       key: "daily_time" },
    { label: "Comunidad",        key: "community" },
    { label: "Curso interés",    key: "interested_course" },
    { label: "¿Por qué comunidad?", key: "why_community" },
    { label: "¿Qué cambiaría?",  key: "life_change" },
    { label: "Info adicional",   key: "additional_info" },
];

// ── Small components ────────────────────────────────────
function StatCard({ label, value, sub, icon, accent = "text-falu-red-600", bg = "bg-falu-red-50" }: {
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

function RateBar({ rate }: { rate: number | null }) {
    if (rate === null) return <span className="text-xs text-gray-300">—</span>;
    const color     = rate >= 50 ? "bg-emerald-500" : rate >= 20 ? "bg-yellow-orange-500" : "bg-red-400";
    const textColor = rate >= 50 ? "text-emerald-700" : rate >= 20 ? "text-yellow-orange-700" : "text-red-600";
    return (
        <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(rate, 100)}%` }} />
            </div>
            <span className={`text-xs font-semibold ${textColor} w-10 text-right`}>{rate}%</span>
        </div>
    );
}

function Badge({ value }: { value: string | null }) {
    if (!value) return <span className="text-gray-300 text-xs">—</span>;
    const map: Record<string, string> = {
        Sí: "bg-green-100 text-green-700", No: "bg-red-100 text-red-600",
        "Tal vez": "bg-yellow-100 text-yellow-700",
        Essential: "bg-blue-100 text-blue-700", Premium: "bg-purple-100 text-purple-700",
        "Speaking Sessions": "bg-orange-100 text-orange-700", Individual: "bg-teal-100 text-teal-700",
    };
    return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${map[value] ?? "bg-zinc-100 text-zinc-600"}`}>{value}</span>;
}

function TextModal({ title, text, onClose }: { title: string; text: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-zinc-800 text-sm">{title}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition">
                        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{text}</p>
            </div>
        </div>
    );
}

// ── Page ────────────────────────────────────────────────
export default function Marketing() {
    const router  = useRouter();
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [mkt, setMkt]             = useState<MarketingData | null>(null);
    const [submissions, setSubmissions] = useState<InterestSubmission[]>([]);
    const [loading, setLoading]     = useState(true);
    const [countrySort, setCountrySort] = useState<"leads" | "paid" | "rate">("leads");
    const [modal, setModal]         = useState<{ title: string; text: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        country: "", english_level: "", community: "", interested_course: "", dateFrom: "", dateTo: "",
    });

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }
            const h = { Authorization: `Bearer ${session.access_token}` };
            const [r1, r2] = await Promise.all([
                fetch(`${BACKEND}/admin/marketing`, { headers: h }),
                fetch(`${BACKEND}/admin/interes`,   { headers: h }),
            ]);
            const [m, i] = await Promise.all([r1.json(), r2.json()]);
            setMkt(m);
            setSubmissions(Array.isArray(i.submissions) ? i.submissions : []);
            setLoading(false);
        }
        load();
    }, []);

    useEffect(() => { setCurrentPage(1); }, [filters]);

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
    if (!mkt) return null;

    // ── Derived ──
    const globalRate  = mkt.totalLeads > 0 ? ((mkt.totalPaid / mkt.totalLeads) * 100).toFixed(1) : "0";
    const topCountry  = [...mkt.conversionByCountry]
        .filter(r => r.rate !== null && r.leads >= 3)
        .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))[0];
    const sortedCountries = [...mkt.conversionByCountry].sort((a, b) => {
        if (countrySort === "leads") return b.leads - a.leads;
        if (countrySort === "paid")  return b.paid  - a.paid;
        return (b.rate ?? -1) - (a.rate ?? -1);
    });
    const maxMotive = mkt.motiveFrequency[0]?.count ?? 1;

    // ── Interest table filters ──
    const countries = Array.from(new Set(submissions.map(s => s.country))).sort();
    const levels    = Array.from(new Set(submissions.map(s => s.english_level))).sort();
    const courses   = Array.from(new Set(submissions.map(s => s.interested_course ?? "Sin selección"))).sort();

    const filtered = submissions.filter(s => {
        if (filters.country          && s.country !== filters.country) return false;
        if (filters.english_level    && s.english_level !== filters.english_level) return false;
        if (filters.community        && s.community !== filters.community) return false;
        if (filters.interested_course) {
            if (filters.interested_course === "Sin selección" ? s.interested_course !== null : s.interested_course !== filters.interested_course) return false;
        }
        if (filters.dateFrom && dayjs.utc(s.created_at).isBefore(dayjs(filters.dateFrom))) return false;
        if (filters.dateTo   && dayjs.utc(s.created_at).isAfter(dayjs(filters.dateTo).endOf("day"))) return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const hasFilters = Object.values(filters).some(Boolean);

    const handleExport = () => {
        const rows = filtered.map(s => ({
            "Fecha (PT)": dayjs.utc(s.created_at).tz(PT).format("DD/MM/YYYY h:mm a"),
            Nombre: s.full_name, Email: s.email, País: s.country,
            "Nivel de inglés": s.english_level, Motivo: s.motive,
            "Mayor dificultad": s.main_difficulty, "Rutina diaria": s.daily_routine,
            "Tiempo por día": s.daily_time, "Participaría comunidad": s.community,
            "Curso de interés": s.interested_course ?? "Sin selección",
            "¿Por qué comunidad?": s.why_community ?? "",
            "¿Qué cambiaría?": s.life_change ?? "", "Info adicional": s.additional_info ?? "",
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Interesados");
        saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }), "interesados.xlsx");
    };

    const LongText = ({ title, value }: { title: string; value: string | null }) => {
        if (!value) return <span className="text-gray-300 text-xs">—</span>;
        const preview = value.length > 40 ? value.slice(0, 40) + "…" : value;
        return (
            <button className="text-xs text-left text-zinc-600 hover:text-falu-red-700 hover:underline transition max-w-[160px] truncate block"
                onClick={() => setModal({ title, text: value })} title="Ver completo">
                {preview}
            </button>
        );
    };

    return (
        <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
            {modal && <TextModal title={modal.title} text={modal.text} onClose={() => setModal(null)} />}

            {/* ── Header ── */}
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Marketing</h1>
                <p className="text-sm text-gray-400 mt-1">Conversión por país, motivaciones y formularios de interés</p>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total leads" value={mkt.totalLeads}
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <StatCard label="Convirtieron" value={mkt.totalPaid}
                    bg="bg-emerald-50" accent="text-emerald-600"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard label="Tasa global" value={`${globalRate}%`}
                    sub={`${mkt.totalPaid} de ${mkt.totalLeads} leads`}
                    bg="bg-violet-50" accent="text-violet-600"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                />
                <StatCard
                    label="Mejor conversión"
                    value={topCountry ? topCountry.country : "—"}
                    sub={topCountry ? `${topCountry.rate}% (${topCountry.leads} leads)` : "mín. 3 leads"}
                    bg="bg-yellow-50" accent="text-yellow-600"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" /></svg>}
                />
            </div>

            {/* ── Conversion + Motives ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
                {/* Conversion by country */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700">Conversión por país</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Formularios de interés → pagos</p>
                        </div>
                        <div className="flex gap-1">
                            {(["leads", "paid", "rate"] as const).map(s => (
                                <button key={s} onClick={() => setCountrySort(s)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${countrySort === s ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                                    {s === "leads" ? "Leads" : s === "paid" ? "Pagaron" : "Tasa"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-auto max-h-[440px]">
                        <table className="min-w-full">
                            <thead className="sticky top-0 bg-gray-50">
                                <tr>
                                    <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">País</th>
                                    <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Leads</th>
                                    <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Pagaron</th>
                                    <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tasa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sortedCountries.map(row => (
                                    <tr key={row.country} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-2.5 text-sm font-medium text-gray-700">{row.country}</td>
                                        <td className="px-4 py-2.5 text-sm text-right text-gray-500">{row.leads}</td>
                                        <td className="px-4 py-2.5 text-sm text-right font-semibold text-gray-700">{row.paid}</td>
                                        <td className="px-5 py-2.5"><RateBar rate={row.rate} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Motive frequency */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h2 className="text-sm font-semibold text-gray-700">Motivos más frecuentes</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Top {mkt.motiveFrequency.length} razones de los formularios de interés</p>
                    </div>
                    <div className="overflow-auto max-h-[440px] px-5 py-4">
                        {mkt.motiveFrequency.length === 0 ? (
                            <p className="text-sm text-gray-300 text-center py-8">Sin datos</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {mkt.motiveFrequency.map((row, i) => (
                                    <div key={i}>
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="flex items-start gap-2 min-w-0">
                                                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-gray-100 text-gray-400 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                                <span className="text-sm text-gray-700 leading-snug">{row.motive}</span>
                                            </div>
                                            <span className="flex-shrink-0 text-xs font-semibold text-gray-500 mt-0.5">{row.count}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden ml-7">
                                            <div className="h-full rounded-full bg-falu-red-500 transition-all duration-500"
                                                style={{ width: `${Math.round((row.count / maxMotive) * 100)}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-4 mb-7">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Formularios de interés</span>
                <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-5 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    {[
                        { label: "País", key: "country", options: countries },
                        { label: "Nivel", key: "english_level", options: levels },
                        { label: "Curso", key: "interested_course", options: courses },
                    ].map(({ label, key, options }) => (
                        <div key={key} className="flex flex-col">
                            <label className="text-xs text-gray-500 font-medium mb-1">{label}</label>
                            <select className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm bg-white"
                                value={filters[key as keyof typeof filters]}
                                onChange={e => setFilters({ ...filters, [key]: e.target.value })}>
                                <option value="">Todos</option>
                                {options.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Comunidad</label>
                        <select className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm bg-white"
                            value={filters.community} onChange={e => setFilters({ ...filters, community: e.target.value })}>
                            <option value="">Todos</option>
                            <option>Sí</option><option>No</option><option>Tal vez</option>
                        </select>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <label className="text-xs text-gray-500 font-medium mb-1">Desde</label>
                        <input type="date" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm max-w-full"
                            value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <label className="text-xs text-gray-500 font-medium mb-1">Hasta</label>
                        <input type="date" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm max-w-full"
                            value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} />
                    </div>
                    {hasFilters && (
                        <div className="flex flex-col justify-end">
                            <button onClick={() => setFilters({ country: "", english_level: "", community: "", interested_course: "", dateFrom: "", dateTo: "" })}
                                className="p-2 text-xs text-zinc-500 hover:text-zinc-700 underline transition">
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
                <button onClick={handleExport}
                    className="flex items-center gap-2 bg-yellow-orange-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-orange-600 transition shadow-sm text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Excel
                </button>
            </div>

            <p className="text-xs text-gray-400 mb-3 px-1">
                {filtered.length === 0 ? "Sin registros" : (
                    <><strong className="text-gray-600">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> de <strong className="text-gray-600">{filtered.length}</strong> registros</>
                )}
            </p>

            {/* ── Table ── */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {TABLE_HEADERS.map(h => (
                                <th key={h.key} className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginated.length === 0 ? (
                            <tr><td colSpan={TABLE_HEADERS.length} className="text-center py-12 text-gray-300 text-sm">Sin registros para los filtros aplicados.</td></tr>
                        ) : paginated.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">{dayjs.utc(s.created_at).tz(PT).format("DD/MM/YY h:mm a")}</td>
                                <td className="px-3 py-2 whitespace-nowrap font-semibold text-gray-800">{s.full_name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-gray-500">{s.email}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-gray-600">{s.country}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{s.english_level}</td>
                                <td className="px-3 py-2 text-xs text-gray-500 max-w-[140px] truncate" title={s.motive}>{s.motive}</td>
                                <td className="px-3 py-2 text-xs text-gray-500 max-w-[140px] truncate" title={s.main_difficulty}>{s.main_difficulty}</td>
                                <td className="px-3 py-2"><Badge value={s.daily_routine} /></td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{s.daily_time}</td>
                                <td className="px-3 py-2"><Badge value={s.community} /></td>
                                <td className="px-3 py-2"><Badge value={s.interested_course} /></td>
                                <td className="px-3 py-2"><LongText title="¿Por qué comunidad?" value={s.why_community} /></td>
                                <td className="px-3 py-2"><LongText title="¿Qué cambiaría en tu vida?" value={s.life_change} /></td>
                                <td className="px-3 py-2"><LongText title="Información adicional" value={s.additional_info} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-400">Pág. <strong className="text-gray-600">{currentPage}</strong> / <strong className="text-gray-600">{totalPages}</strong></p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-white transition">← Ant.</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-white transition">Sig. →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
