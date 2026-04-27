"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail]               = useState("");
    const [password, setPassword]         = useState("");
    const [errorMsg, setErrorMsg]         = useState("");
    const [loading, setLoading]           = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setErrorMsg("Invalid credentials. Please check your email and password.");
            setLoading(false);
            return;
        }
        router.push("/admin/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#faf9f7] px-4">

            {/* ── Mesh background ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%]  w-[520px] h-[520px] rounded-full bg-yellow-orange-300/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[480px] h-[480px] rounded-full bg-falu-red-300/15 blur-[120px]" />
                <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-orange-200/10 blur-[80px]" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                    }}
                />
            </div>

            {/* ── Card with gradient border ── */}
            <div className="relative w-full max-w-[400px]">
                <div className="p-px rounded-[28px] bg-gradient-to-br from-white/90 via-gray-200/60 to-gray-100/40 shadow-2xl shadow-gray-400/20">
                    <div className="bg-white/80 backdrop-blur-2xl rounded-[27px] px-8 py-9">

                        {/* Brand */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-falu-red-600 to-yellow-orange-400 flex items-center justify-center shadow-md shadow-red-300/40 flex-shrink-0">
                                <span className="text-white font-black text-sm tracking-tight">LZ</span>
                            </div>
                            <div className="leading-none">
                                <p className="text-base font-bold text-gray-900">LZ Academy</p>
                                <p className="text-xs text-gray-400 mt-0.5">Admin panel</p>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="mb-7">
                            <h1 className="text-[26px] font-bold text-gray-900 leading-tight tracking-tight">
                                Welcome<br />back.
                            </h1>
                        </div>

                        {/* Error */}
                        {errorMsg && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl mb-5 text-sm">
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                                {errorMsg}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@lz-academy.com"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 text-sm border border-gray-200/80 rounded-2xl bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 focus:border-transparent transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-12 text-sm border border-gray-200/80 rounded-2xl bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 focus:border-transparent transition-all placeholder:text-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        tabIndex={-1}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-lg cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl transition-all duration-200 font-semibold text-sm mt-2 cursor-pointer tracking-wide"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-400 mt-7">
                            © {new Date().getFullYear()} LZ English Academy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
