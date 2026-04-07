"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface ContentConfig {
    email_no_response_title: string;
    success_contact_message: string;
}

const DEFAULTS: ContentConfig = {
    email_no_response_title: "¿No recibes respuesta en tres dias?",
    success_contact_message: "En las próximas 24 horas nuestro equipo te contactará con todos los detalles.",
};

export default function ContenidoPage() {
    const [content, setContent] = useState<ContentConfig>(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/config/content`);
            if (res.ok) setContent(await res.json());
            setLoading(false);
        }
        load();
    }, []);

    async function handleSave() {
        setSaving(true);
        setSaved(false);
        setError("");

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push("/admin/login"); return; }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/config/content`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        if (res.ok) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } else {
            setError("Error guardando los cambios. Intenta de nuevo.");
        }
        setSaving(false);
    }

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
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <div className="mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Contenido editable</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Edita los textos que aparecen en el correo de confirmación y en la página de pago exitoso.
                </p>
            </div>

            <div className="flex flex-col gap-5">

                {/* Email: aviso sin respuesta */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-700">Aviso en el correo de confirmación</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Aparece en el correo que recibe el usuario al pagar, en el bloque naranja de contacto.
                        </p>
                    </div>
                    <label className="text-xs text-gray-400 font-medium block mb-1">Título del aviso</label>
                    <input
                        type="text"
                        value={content.email_no_response_title}
                        onChange={(e) => setContent({ ...content, email_no_response_title: e.target.value })}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50"
                        placeholder="¿No recibes respuesta en tres dias?"
                    />
                    <div className="mt-2.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-xs text-amber-700">
                            <strong>Vista previa:</strong> {content.email_no_response_title}
                        </p>
                    </div>
                </div>

                {/* Success page: mensaje de contacto */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-700">Mensaje en la página de pago exitoso</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Aparece debajo de "¡Tu inscripción quedó registrada!" en la página <strong>/success</strong>.
                        </p>
                    </div>
                    <label className="text-xs text-gray-400 font-medium block mb-1">Mensaje de contacto</label>
                    <textarea
                        value={content.success_contact_message}
                        onChange={(e) => setContent({ ...content, success_contact_message: e.target.value })}
                        rows={3}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-orange-300 bg-gray-50 resize-none"
                        placeholder="En las próximas 24 horas nuestro equipo te contactará con todos los detalles."
                    />
                    <div className="mt-2.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-xs text-amber-700">
                            <strong>Vista previa:</strong> {content.success_contact_message}
                        </p>
                    </div>
                </div>

            </div>

            {/* Feedback */}
            {error && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {error}
                </div>
            )}
            {saved && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Cambios guardados correctamente.
                </div>
            )}

            <div className="mt-5 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-falu-red-700 text-white text-sm font-semibold rounded-xl hover:bg-falu-red-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {saving ? "Guardando…" : "Guardar cambios"}
                </button>
            </div>
        </div>
    );
}
