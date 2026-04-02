"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

interface DashboardStats {
    total: number;
    byCountry: Record<string, number>;
    byCourse: Record<string, number>;
    byCommunity: Record<string, number>;
}

const PAGE_SIZE = 15;

function StatCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string | number;
    accent: string;
}) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 border-l-4 ${accent} hover:shadow-md transition-shadow`}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
    );
}

function Badge({ value }: { value: string | null }) {
    if (!value) return <span className="text-gray-300 text-xs">—</span>;

    const map: Record<string, string> = {
        Sí: "bg-green-100 text-green-700",
        No: "bg-red-100 text-red-600",
        "Tal vez": "bg-yellow-100 text-yellow-700",
        Essential: "bg-blue-100 text-blue-700",
        Premium: "bg-purple-100 text-purple-700",
        "Speaking Sessions": "bg-orange-100 text-orange-700",
        Individual: "bg-teal-100 text-teal-700",
    };

    const cls = map[value] ?? "bg-zinc-100 text-zinc-600";
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {value}
        </span>
    );
}

function TextModal({
    title,
    text,
    onClose,
}: {
    title: string;
    text: string;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
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

const TABLE_HEADERS = [
    { label: "Fecha", key: "created_at" },
    { label: "Nombre", key: "full_name" },
    { label: "Email", key: "email" },
    { label: "País", key: "country" },
    { label: "Nivel", key: "english_level" },
    { label: "Motivo", key: "motive" },
    { label: "Dificultad", key: "main_difficulty" },
    { label: "Rutina diaria", key: "daily_routine" },
    { label: "Tiempo/día", key: "daily_time" },
    { label: "Comunidad", key: "community" },
    { label: "Curso interés", key: "interested_course" },
    { label: "¿Por qué comunidad?", key: "why_community" },
    { label: "¿Qué cambiaría?", key: "life_change" },
    { label: "Info adicional", key: "additional_info" },
];

interface ConversionData {
    converted: number;
    totalLeads: number;
    rate: number;
}

export default function InterestDashboard() {
    const [submissions, setSubmissions] = useState<InterestSubmission[]>([]);
    const [conversion, setConversion] = useState<ConversionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        country: "",
        english_level: "",
        community: "",
        interested_course: "",
        dateFrom: "",
        dateTo: "",
    });
    const [modal, setModal] = useState<{ title: string; text: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin/login");
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/interes`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            const result = await response.json();
            if (result.submissions) {
                setSubmissions(result.submissions);
                setConversion({ converted: result.converted, totalLeads: result.totalLeads, rate: result.rate });
            } else if (Array.isArray(result)) {
                setSubmissions(result);
            }
            setLoading(false);
        }

        loadData();
    }, []);

    // Reset página al cambiar filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const countries = Array.from(new Set(submissions.map((s) => s.country))).sort();
    const levels = Array.from(new Set(submissions.map((s) => s.english_level))).sort();
    const courses = Array.from(
        new Set(submissions.map((s) => s.interested_course ?? "Sin selección"))
    ).sort();

    const filtered = submissions.filter((s) => {
        if (filters.country && s.country !== filters.country) return false;
        if (filters.english_level && s.english_level !== filters.english_level) return false;
        if (filters.community && s.community !== filters.community) return false;
        if (
            filters.interested_course &&
            (filters.interested_course === "Sin selección"
                ? s.interested_course !== null
                : s.interested_course !== filters.interested_course)
        )
            return false;
        if (filters.dateFrom && dayjs.utc(s.created_at).isBefore(dayjs(filters.dateFrom)))
            return false;
        if (filters.dateTo && dayjs.utc(s.created_at).isAfter(dayjs(filters.dateTo).endOf("day")))
            return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const stats: DashboardStats = {
        total: filtered.length,
        byCountry: filtered.reduce<Record<string, number>>((acc, s) => {
            acc[s.country] = (acc[s.country] ?? 0) + 1;
            return acc;
        }, {}),
        byCourse: filtered.reduce<Record<string, number>>((acc, s) => {
            const key = s.interested_course ?? "Sin selección";
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
        }, {}),
        byCommunity: filtered.reduce<Record<string, number>>((acc, s) => {
            acc[s.community] = (acc[s.community] ?? 0) + 1;
            return acc;
        }, {}),
    };

    const topCountry =
        Object.entries(stats.byCountry).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const topCourse =
        Object.entries(stats.byCourse).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    const handleExportExcel = () => {
        const exportData = filtered.map((s) => ({
            Fecha: dayjs.utc(s.created_at).format("DD/MM/YYYY HH:mm"),
            Nombre: s.full_name,
            Email: s.email,
            País: s.country,
            "Nivel de inglés": s.english_level,
            Motivo: s.motive,
            "Mayor dificultad": s.main_difficulty,
            "Rutina diaria": s.daily_routine,
            "Tiempo por día": s.daily_time,
            "Participaría comunidad": s.community,
            "Curso de interés": s.interested_course ?? "Sin selección",
            "¿Por qué comunidad?": s.why_community ?? "",
            "¿Qué cambiaría?": s.life_change ?? "",
            "Info adicional": s.additional_info ?? "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Interesados");
        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "interesados.xlsx");
    };

    const LongText = ({ title, value }: { title: string; value: string | null }) => {
        if (!value) return <span className="text-gray-300 text-xs">—</span>;
        const preview = value.length > 40 ? value.slice(0, 40) + "…" : value;
        return (
            <button
                className="text-xs text-left text-zinc-600 hover:text-falu-red-700 hover:underline transition max-w-[160px] truncate block"
                onClick={() => setModal({ title, text: value })}
                title="Ver completo"
            >
                {preview}
            </button>
        );
    };

    if (loading)
        return (
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

            {modal && (
                <TextModal title={modal.title} text={modal.text} onClose={() => setModal(null)} />
            )}

            {/* Header */}
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Formularios de interés</h1>
                <p className="text-sm text-gray-400 mt-1">Formularios de interés recibidos</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-7">
                <StatCard label="Total formularios" value={stats.total} accent="border-yellow-orange-500" />
                <StatCard label="País con más interés" value={topCountry} accent="border-yellow-orange-400" />
                <StatCard
                    label="Quieren comunidad"
                    value={stats.byCommunity["Sí"] ?? 0}
                    accent="border-green-400"
                />
                <StatCard label="Curso más solicitado" value={topCourse} accent="border-yellow-orange-300" />
                {conversion && (
                    <div className="bg-white rounded-2xl shadow-sm border-l-4 border-violet-400 border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tasa de conversión</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{conversion.rate}%</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {conversion.converted} de {conversion.totalLeads} leads pagaron
                        </p>
                    </div>
                )}
            </div>

            {/* Filters + Export */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-5 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-wrap gap-4 w-full md:w-auto">

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">País</label>
                        <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm"
                            value={filters.country}
                            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        >
                            <option value="">Todos</option>
                            {countries.map((c) => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Nivel de inglés</label>
                        <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm"
                            value={filters.english_level}
                            onChange={(e) => setFilters({ ...filters, english_level: e.target.value })}
                        >
                            <option value="">Todos</option>
                            {levels.map((l) => <option key={l}>{l}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Comunidad</label>
                        <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm"
                            value={filters.community}
                            onChange={(e) => setFilters({ ...filters, community: e.target.value })}
                        >
                            <option value="">Todos</option>
                            <option>Sí</option>
                            <option>No</option>
                            <option>Tal vez</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Curso de interés</label>
                        <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm"
                            value={filters.interested_course}
                            onChange={(e) => setFilters({ ...filters, interested_course: e.target.value })}
                        >
                            <option value="">Todos</option>
                            {courses.map((c) => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Desde</label>
                        <input
                            type="date"
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Hasta</label>
                        <input
                            type="date"
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm text-sm"
                            value={filters.dateTo}
                            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        />
                    </div>

                    {Object.values(filters).some(Boolean) && (
                        <div className="flex flex-col justify-end">
                            <button
                                onClick={() => setFilters({ country: "", english_level: "", community: "", interested_course: "", dateFrom: "", dateTo: "" })}
                                className="p-2 text-xs text-zinc-500 hover:text-zinc-700 underline transition"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-auto flex justify-start md:justify-end">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 bg-yellow-orange-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-orange-600 transition shadow-sm text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Excel
                    </button>
                </div>
            </div>

            {/* Result count */}
            <p className="text-xs text-gray-400 mb-3 px-1">
                {filtered.length === 0 ? "Sin registros" : (
                    <><strong className="text-gray-600">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> de <strong className="text-gray-600">{filtered.length}</strong> registros</>
                )}
            </p>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {TABLE_HEADERS.map((h) => (
                                <th
                                    key={h.key}
                                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {h.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={TABLE_HEADERS.length} className="text-center py-12 text-gray-300 text-sm">
                                    Sin registros para los filtros aplicados.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">
                                        {dayjs.utc(s.created_at).format("DD/MM/YY HH:mm")}
                                    </td>
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
                                    <td className="px-3 py-2">
                                        <LongText title="¿Por qué comunidad?" value={s.why_community} />
                                    </td>
                                    <td className="px-3 py-2">
                                        <LongText title="¿Qué cambiaría en tu vida?" value={s.life_change} />
                                    </td>
                                    <td className="px-3 py-2">
                                        <LongText title="Información adicional" value={s.additional_info} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-400">
                            Pág. <strong className="text-gray-600">{currentPage}</strong> / <strong className="text-gray-600">{totalPages}</strong>
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-white transition">← Ant.</button>
                            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-white transition">Sig. →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}