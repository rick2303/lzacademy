"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface User {
    id: number;
    email: string;
    full_name: string;
    country: string;
    plan: string;
    level: string;
    motive: string;
    status: string;
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
            País: u.country,
            Plan: u.plan,
            Nivel: u.level,
            Estado: u.status,
            "Último Pago": u.last_payment_date
                ? new Date(u.last_payment_date).toLocaleDateString()
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
        const matchDate = filters.paymentDate
            ? user.last_payment_date?.startsWith(filters.paymentDate)
            : true;
        return matchCountry && matchStatus && matchDate;
    });

    const countries = Array.from(new Set(data.users.map((u) => u.country)));
    const statuses = Array.from(new Set(data.users.map((u) => u.status)));

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-falu-red-700">Dashboard Admin</h2>
                <button
                    onClick={handleLogout}
                    className="bg-falu-red-500 text-white px-5 py-2 rounded-lg hover:bg-falu-red-600 transition"
                >
                    Cerrar sesión
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-orange-500 hover:shadow-lg transition">
                    <p className="text-gray-400">Total Usuarios</p>
                    <p className="text-2xl font-bold text-gray-800">{data.totalUsers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-orange-400 hover:shadow-lg transition">
                    <p className="text-gray-400">Total Pagos</p>
                    <p className="text-2xl font-bold text-gray-800">{data.totalPayments}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-orange-300 hover:shadow-lg transition">
                    <p className="text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">
                        ${(data.totalRevenue / 100).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Filters + Export */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="flex flex-wrap gap-3">
                    <select
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400"
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

                    <select
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400"
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

                    <input
                        type="date"
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-orange-400"
                        value={filters.paymentDate}
                        onChange={(e) => setFilters({ ...filters, paymentDate: e.target.value })}
                    />
                </div>

                <button
                    onClick={handleExportExcel}
                    className="bg-yellow-orange-500 text-white px-4 py-2 rounded hover:bg-yellow-orange-600 transition"
                >
                    Exportar Excel
                </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-falu-red-50">
                        <tr>
                            {[
                                "ID",
                                "Email",
                                "Nombre",
                                "País",
                                "Plan",
                                "Nivel",
                                "Motivo",
                                "Estado",
                                "Último Pago",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-4 py-3 text-left text-xs font-medium text-falu-red-700 uppercase tracking-wider"
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
                                <td className="px-4 py-2">{user.id}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.full_name}</td>
                                <td className="px-4 py-2">{user.country}</td>
                                <td className="px-4 py-2">{user.plan}</td>
                                <td className="px-4 py-2">{user.level}</td>
                                <td className="px-4 py-2">{user.motive}</td>
                                <td className="px-4 py-2">{user.status}</td>
                                <td className="px-4 py-2">
                                    {user.last_payment_date
                                        ? new Date(user.last_payment_date).toLocaleDateString()
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
