"use client";
import { useState } from "react";

const CALENDLY_PREMIUM_BY_LEVEL: Record<string, string> = {
    A1: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A1_URL || "https://calendly.com/lzacademy590/a1-daily-classes",
    A2: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A2_URL || "https://calendly.com/lzacademy590/a2-daily-classes",
    B1: process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_B1_URL || "https://calendly.com/lzacademy590/b1-daily-classes",
};

export default function PremiumButton() {
    const [isOpen, setIsOpen] = useState(false);

    const goToPremiumCalendly = (level: "A1" | "A2" | "B1") => {
        window.open(CALENDLY_PREMIUM_BY_LEVEL[level], "_blank");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-900 bg-white hover:bg-zinc-50 transition shadow-sm cursor-pointer"
            >
                Seleccionar Premium
            </button>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div
                        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-falu-red-200 p-6 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-extrabold text-zinc-900">Elige tu nivel de inglés</h3>
                                <p className="mt-1 text-sm text-zinc-600">
                                    Te llevaremos al Calendly correcto para tu plan Premium.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100"
                                aria-label="Cerrar"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                onClick={() => goToPremiumCalendly("A1")}
                                className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition"
                            >
                                A1 — Principiante
                            </button>
                            <button
                                onClick={() => goToPremiumCalendly("A2")}
                                className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition"
                            >
                                A2 — Básico
                            </button>
                            <button
                                onClick={() => goToPremiumCalendly("B1")}
                                className="rounded-xl px-4 py-3 text-sm font-semibold bg-falu-red-700 text-white hover:bg-falu-red-800 transition"
                            >
                                B1 — Intermedio
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-zinc-500">
                            Si no estás seguro, elige el más cercano; luego podemos ajustarlo.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
