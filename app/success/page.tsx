"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type UiState = "loading" | "success" | "error";
type Plan = "Essential" | "Premium" | "Speaking";

/* const CALENDLY_SPEAKING_URL =
    process.env.NEXT_PUBLIC_CALENDLY_SPEAKING_URL || "https://calendly.com/lzacademy590/speaking-session"; */

/*const CALENDLY_PREMIUM_BY_LEVEL: Record<string, string> = {
    "Principiante (A1)": process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A1_URL || "https://calendly.com/lzacademy590/a1-daily-classes",
    "Basico": process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A2_URL || "https://calendly.com/lzacademy590/a2-daily-classes",
    "Intermedio": process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_B1_URL || "https://calendly.com/lzacademy590/b1-daily-classes",
    "Intermedio alto": process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_B2_URL || "https://calendly.com/lzacademy590/b2-daily-classes",
    "Básico (A2)": process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A2_URL || "https://calendly.com/lzacademy590/a2-daily-classes",
}; */

const SuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const session_id = useMemo(() => searchParams.get("session_id"), [searchParams]);

    const [state, setState] = useState<UiState>("loading");
    const [message, setMessage] = useState<string>("Verificando el estado de tu pago...");
    const [detail, setDetail] = useState<string>("");

    /*   const [paidPlan, setPaidPlan] = useState<Plan | null>(null);
         const [paidLevel, setPaidLevel] = useState<string | null>(null);
     
           const calendlyInfo = useMemo(() => {
               if (state !== "success") return null;
                       if (paidPlan === "Speaking") {
                           return {
                               url: CALENDLY_SPEAKING_URL,
                               title: "Tu sesión de Speaking está lista",
                               subtitle: "Agenda tu sesión aquí:",
                           };
                       }
               
                       if (paidPlan === "Premium") {
                           const premiumUrl = (paidLevel && CALENDLY_PREMIUM_BY_LEVEL[paidLevel]) || process.env.NEXT_PUBLIC_CALENDLY_PREMIUM_A1_URL;
               
                           return {
                               url: premiumUrl || "https://calendly.com/lzacademy590/a1-daily-classes",
                               title: "Tu plan Premium incluye clases diarias",
                               subtitle: paidLevel ? `Agenda tus clases (nivel: ${paidLevel}) aquí:` : "Agenda tus clases aquí:",
                           };
                       }
               
               return null;
           }, [state, paidPlan, paidLevel]); */

    useEffect(() => {
        if (!session_id) {
            setState("error");
            setMessage("No encontramos el identificador de la sesión.");
            setDetail("Vuelve a la página principal e intenta de nuevo.");
            return;
        }

        const verifyPayment = async () => {
            try {
                setState("loading");
                setMessage("Verificando el estado de tu pago...");
                setDetail("Esto puede tardar unos segundos.");

                const response = await fetch(`${BACKEND_URL}/payment-success`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_id }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.error || "No se pudo verificar el pago");
                }

                /* setPaidPlan((data?.plan as Plan) || null);
                setPaidLevel((data?.level as string) || null); */

                setState("success");
                setMessage("Pago confirmado. ¡Gracias por inscribirte! 🙌");
                setDetail(
                    data?.message ||
                    "Tu pago se registró correctamente. Nuestro equipo te contactará en breve para darte detalles y próximos pasos."
                );
            } catch (err: any) {
                console.error("Error al verificar el pago:", err);
                setState("error");
                setMessage("No pudimos verificar tu pago.");
                setDetail(err?.message || "Intenta nuevamente o contáctanos si el problema persiste.");
            }
        };

        verifyPayment();
    }, [session_id, BACKEND_URL]);

    //const showCalendly = state === "success" && !!calendlyInfo;

    return (
        <div className="min-h-screen bg-linear-to-b from-falu-red-50 via-white to-falu-red-50 flex items-center justify-center px-4">
            <div className="w-full max-w-xl">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-falu-red-200">
                    <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-falu-red-300/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-yellow-orange-300/20 blur-3xl" />

                    <div className="relative p-8 sm:p-10">
                        {/* Icono grande según estado */}
                        <div className="flex items-center justify-center">
                            {state === "loading" && (
                                <div className="h-14 w-14 rounded-full ring-1 ring-falu-red-200 bg-falu-red-50 flex items-center justify-center">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-falu-red-700 border-t-transparent" />
                                </div>
                            )}

                            {state === "success" && (
                                <div className="h-14 w-14 rounded-full bg-green-50 ring-1 ring-green-200 flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-7 w-7 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                                    </svg>
                                </div>
                            )}

                            {state === "error" && (
                                <div className="h-14 w-14 rounded-full bg-red-50 ring-1 ring-red-200 flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-7 w-7 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Título principal */}
                        <h1 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-zinc-900">
                            {state === "loading" && "Estamos confirmando tu pago"}
                            {state === "success" && "¡Pago confirmado! ✅"}
                            {state === "error" && "No pudimos confirmar el pago"}
                        </h1>

                        {/* Mensajes */}
                        <p className="mt-3 text-center text-zinc-600">{message}</p>
                        {detail && <p className="mt-2 text-center text-sm text-zinc-500">{detail}</p>}

                        {/* Qué pasa ahora (solo success) */}
                        {state === "success" && (
                            <div className="mt-6 rounded-2xl bg-green-50 p-5 ring-1 ring-green-200">
                                <p className="text-sm font-bold text-green-900 text-center">
                                    ¡Listo! Tu inscripción quedó registrada.
                                </p>
                                <p className="mt-2 text-sm text-green-800 text-center">
                                    En breve nuestro equipo te contactará para darte los detalles y los siguientes pasos.
                                </p>

                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl bg-white/70 p-3 ring-1 ring-green-200">
                                        <p className="text-xs font-semibold text-green-900">1) Confirmación</p>
                                        <p className="mt-1 text-xs text-green-800">Pago validado correctamente.</p>
                                    </div>
                                    <div className="rounded-xl bg-white/70 p-3 ring-1 ring-green-200">
                                        <p className="text-xs font-semibold text-green-900">2) Contacto</p>
                                        <p className="mt-1 text-xs text-green-800">Te escribimos por el medio registrado.</p>
                                    </div>
                                    <div className="rounded-xl bg-white/70 p-3 ring-1 ring-green-200">
                                        <p className="text-xs font-semibold text-green-900">3) Inicio</p>
                                        <p className="mt-1 text-xs text-green-800">Te damos acceso y el plan de arranque.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* session id (útil para soporte) */}
                        {session_id && (
                            <div className="mt-6 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                                <p className="text-xs font-semibold text-zinc-700">Referencia de pago</p>
                                <p className="mt-1 break-all text-xs text-zinc-600">{session_id}</p>
                            </div>
                        )}

                        {/* Premium o Speaking */}
                        {/*}
            {showCalendly && calendlyInfo && (
                <div className="mt-6 rounded-2xl bg-green-50 p-5 ring-1 ring-green-200">
                    <p className="text-sm font-bold text-green-800 text-center">
                        {calendlyInfo.title}
                    </p>
                    <p className="mt-2 text-sm text-green-700 text-center">
                        {calendlyInfo.subtitle}
                    </p>

                    <div className="mt-4 flex justify-center">
                        <a
                            href={calendlyInfo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition shadow-sm"
                        >
                            Agendar en Calendly
                        </a>
                    </div>
                </div>
            )} */}

                        {/* Botones */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => router.push("/")}
                                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-falu-red-700 hover:bg-falu-red-800 transition shadow-sm"
                            >
                                Volver al inicio
                            </button>

                            {state === "error" && (
                                <button
                                    onClick={() => router.refresh()}
                                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-falu-red-800 ring-1 ring-inset ring-falu-red-200 hover:bg-falu-red-50 transition"
                                >
                                    Reintentar verificación
                                </button>
                            )}
                        </div>

                        {/* Nota final */}
                        {state === "success" && (
                            <p className="mt-6 text-center text-xs text-zinc-500">
                                Si necesitas ayuda, contáctanos y comparte tu referencia de pago para ayudarte más rápido.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
