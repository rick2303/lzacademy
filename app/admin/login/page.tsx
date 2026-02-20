"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setErrorMsg("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.log("Supabase error:", error);
            setErrorMsg(error.message);
            return;
        }

        router.push("/admin/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-falu-red-50 px-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm">
                <h2 className="text-3xl font-bold mb-6 text-center text-falu-red-700">
                    Admin Login
                </h2>

                {errorMsg && (
                    <div className="bg-falu-red-100 text-falu-red-700 p-3 rounded mb-4 text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 transition"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-orange-400 transition"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-falu-red-500 text-white py-2 rounded-lg hover:bg-falu-red-600 transition font-semibold"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} LZ English Academy Admin Panel
                </p>
            </div>
        </div>
    );
}
