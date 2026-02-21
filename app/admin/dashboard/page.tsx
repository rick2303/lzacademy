"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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
    users: User[];
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [filters, setFilters] = useState({
        country: "",
        status: "",
        inscriptionDate: "",
        paymentDate: "",
    });
    const router = useRouter();

    useEffect(() => {
        async function loadDashboard() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin/login");
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            const result = await response.json();
            setData(result);
        }

        loadDashboard();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const handleExportExcel = () => {
        if (!data) return;

        const exportData = filteredUsers.map((u) => ({
            ID: u.id,
            Email: u.email,
            Nombre: u.full_name,
            "Fecha de Inicio": u.inscription_date
                ? dayjs.utc(u.inscription_date).format("DD/MM/YYYY")
                : "N/A",
            País: u.country,
            Plan: u.plan,
            Nivel: u.level,
            Motivo: u.motive,
            Estado: u.status,
            "Último Pago": u.last_payment_date
                ? dayjs.utc(u.last_payment_date).format("DD/MM/YYYY")
                : "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "usuarios.xlsx");
    };

    if (!data)
        return (
            <p className="text-center mt-20 text-gray-400 text-lg font-medium">
                Cargando...
            </p>
        );

    const filteredUsers = data.users.filter((user) => {
        const matchCountry = filters.country ? user.country === filters.country : true;
        const matchStatus = filters.status ? user.status === filters.status : true;
        const matchInscription = filters.inscriptionDate
            ? user.inscription_date?.startsWith(filters.inscriptionDate)
            : true;
        const matchPayment = filters.paymentDate
            ? user.last_payment_date?.startsWith(filters.paymentDate)
            : true;

        return matchCountry && matchStatus && matchInscription && matchPayment;
    });

    const countries = Array.from(new Set(data.users.map((u) => u.country)));
    const statuses = Array.from(new Set(data.users.map((u) => u.status)));

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-falu-red-700">Dashboard Admin</h2>
                <button
                    onClick={handleLogout}
                    className="bg-falu-red-500 text-white px-4 py-2 rounded-lg hover:bg-falu-red-600 transition"
                >
                    Cerrar sesión
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 md:mb-8">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-orange-500 hover:shadow-lg transition">
                    <p className="text-gray-400">Total Usuarios</p>
                    <p className="text-2xl font-bold text-gray-800">{data.totalUsers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-orange-400 hover:shadow-lg transition">
                    <p className="text-gray-400">Total Pagos</p>
                    <p className="text-2xl font-bold text-gray-800">{data.totalPayments}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-orange-300 hover:shadow-lg transition">
                    <p className="text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">
                        ${(data.totalRevenue / 100).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Filters + Export */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-md">
                {/* Filtros */}
                <div className="flex flex-wrap gap-4 md:gap-6 w-full md:w-auto">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">País</label>
                        <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm"
                            value={filters.country}
                            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        >
                            <option value="">Todos los países</option>
                            {countries.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Estado</label>
                        <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">Todos los estados</option>
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Fecha de inscripción</label>
                        <input
                            type="date"
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm"
                            value={filters.inscriptionDate}
                            onChange={(e) => setFilters({ ...filters, inscriptionDate: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Último pago</label>
                        <input
                            type="date"
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 shadow-sm"
                            value={filters.paymentDate}
                            onChange={(e) => setFilters({ ...filters, paymentDate: e.target.value })}
                        />
                    </div>
                </div>

                {/* Botón Export */}
                <div className="w-full md:w-auto flex justify-start md:justify-end">
                    <button
                        onClick={handleExportExcel}
                        className="bg-yellow-orange-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-orange-600 transition shadow-sm mt-2 md:mt-0"
                    >
                        Exportar Excel
                    </button>
                </div>
            </div>


            {/* Users Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200 table-auto md:table-fixed">
                    <thead className="bg-falu-red-50">
                        <tr>
                            {[
                                "ID",
                                "Email",
                                "Nombre",
                                "Fecha de Inicio",
                                "País",
                                "Plan",
                                "Nivel",
                                "Motivo",
                                "Estado",
                                "Último Pago",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-falu-red-700 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-falu-red-100 transition cursor-pointer"
                            >
                                <td className="px-2 sm:px-4 py-1 sm:py-2">{user.id}</td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">{user.email}</td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">{user.full_name}</td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">
                                    {user.inscription_date
                                        ? dayjs.utc(user.inscription_date).format("DD/MM/YYYY")
                                        : "N/A"}
                                </td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">{user.country}</td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">{user.plan}</td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">{user.level}</td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">{user.motive}</td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">{user.status}</td>
                                <td className="px-2 sm:px-4 py-1 sm:py-2">
                                    {user.last_payment_date
                                        ? dayjs.utc(user.last_payment_date).format("DD/MM/YYYY")
                                        : "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
