"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CAL_LINK = "loren-lainez-hvhvq3/daily-classes";

type UiState = "loading" | "success" | "error";

const SuccessContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const session_id = useMemo(() => searchParams.get("session_id"), [searchParams]);

    const [state, setState] = useState<UiState>("loading");
    const [message, setMessage] = useState<string>("Verificando el estado de tu pago...");
    const [detail, setDetail] = useState<string>("");
    const [userData, setUserData] = useState<any>(null);
    const [schedulingStatus, setSchedulingStatus] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [contactMessage, setContactMessage] = useState("En las próximas 24 horas nuestro equipo te contactará con todos los detalles.");
    const calInitialized = useRef(false);

    useEffect(() => {
        if (!session_id || !session_id.startsWith("cs_")) {
            setState("error");
            setMessage("Sesión inválida.");
            setDetail("El identificador de pago no es válido.");
            return;
        }

        const verifyPayment = async () => {
            try {
                setState("loading");
                setMessage("Verificando el estado de tu pago...");
                setDetail("Esto puede tardar unos segundos.");

                const response = await fetch(
                    `${BACKEND_URL}/payment-status?session_id=${session_id}`,
                    { method: "GET", headers: { "Content-Type": "application/json" } }
                );

                const data = await response.json();

                if (!response.ok) throw new Error(data?.error || "No se pudo verificar el pago");
                if (!data?.paid) throw new Error("El pago aún no está confirmado.");

                setUserData(data.user || null);
                setSchedulingStatus(data.scheduling_status ?? null);
                setState("success");
                setMessage("¡Gracias por inscribirte!");
                setDetail(data?.message || "Tu pago se registró correctamente. Nuestro equipo te contactará en breve.");
                setTimeout(() => setVisible(true), 100);
            } catch (err: any) {
                setState("error");
                setMessage("No pudimos verificar tu pago.");
                setDetail(err?.message || "Intenta nuevamente o contáctanos si el problema persiste.");
                setTimeout(() => setVisible(true), 100);
            }
        };

        verifyPayment();

        fetch(`${BACKEND_URL}/config/content`)
            .then((r) => r.json())
            .then((d) => { if (d.success_contact_message) setContactMessage(d.success_contact_message); })
            .catch(() => {});
    }, [session_id]);

    useEffect(() => {
        if (state !== "loading") setTimeout(() => setVisible(true), 100);
    }, [state]);

    const isPremiumPending = state === "success" && userData?.plan === "Premium" && schedulingStatus === "pending";

    useEffect(() => {
        if (!isPremiumPending || calInitialized.current) return;
        calInitialized.current = true;

        const script = document.createElement("script");
        script.innerHTML = `
            (function (C, A, L) {
                let p = function (a, ar) { a.q.push(ar); };
                let d = C.document;
                C.Cal = C.Cal || function () {
                    let cal = C.Cal; let ar = arguments;
                    if (!cal.loaded) {
                        cal.ns = {}; cal.q = cal.q || [];
                        d.head.appendChild(d.createElement("script")).src = A;
                        cal.loaded = true;
                    }
                    if (ar[0] === L) {
                        const api = function () { p(api, arguments); };
                        const ns = ar[1]; api.q = api.q || [];
                        typeof ns === "string" ? (cal.ns[ns] = api) && p(api, ar) : p(cal, ar);
                        return;
                    }
                    p(cal, ar);
                };
            })(window, "https://app.cal.com/embed/embed.js", "init");
            Cal("init", { origin: "https://cal.com" });
            Cal("inline", {
                elementOrSelector: "#cal-booking-embed",
                config: { layout: "month_view" },
                calLink: "${CAL_LINK}",
            });
            Cal("ui", {
                styles: { branding: { brandColor: "#9c181d" } },
                hideEventTypeDetails: false,
                layout: "month_view",
            });
        `;
        document.head.appendChild(script);
    }, [isPremiumPending]);

    const formattedStartDate = userData?.inscription_date
        ? new Date(userData.inscription_date + "T00:00:00Z").toLocaleDateString("es-ES", {
            day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
        })
        : null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

                .sc-root {
                    min-height: 100vh;
                    background: #faf8f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px 16px;
                    font-family: 'DM Sans', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .sc-bg-blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                    z-index: 0;
                }
                .sc-bg-blob-1 {
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(156,24,29,0.08) 0%, transparent 70%);
                    top: -100px; left: -100px;
                }
                .sc-bg-blob-2 {
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(224,123,42,0.06) 0%, transparent 70%);
                    bottom: -80px; right: -80px;
                }

                .sc-card {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 560px;
                    background: #ffffff;
                    border-radius: 28px;
                    box-shadow:
                        0 0 0 1px rgba(0,0,0,0.06),
                        0 4px 6px rgba(0,0,0,0.04),
                        0 20px 60px rgba(0,0,0,0.08);
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                .sc-card.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .sc-card.loading-state {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Top accent bar */
                .sc-accent-bar {
                    height: 4px;
                    background: linear-gradient(90deg, #9c181d 0%, #c0321a 50%, #e07b2a 100%);
                }

                .sc-body {
                    padding: 44px 40px 40px;
                }

                /* Status icon */
                .sc-icon-wrap {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 28px;
                }
                .sc-icon-wrap.success {
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                    box-shadow: 0 0 0 8px rgba(134,239,172,0.15), 0 4px 20px rgba(22,163,74,0.12);
                }
                .sc-icon-wrap.error {
                    background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
                    box-shadow: 0 0 0 8px rgba(252,165,165,0.15), 0 4px 20px rgba(239,68,68,0.12);
                }
                .sc-icon-wrap.loading {
                    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                    box-shadow: 0 0 0 8px rgba(156,24,29,0.08);
                }

                .sc-spinner {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 2.5px solid rgba(156,24,29,0.2);
                    border-top-color: #9c181d;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Title */
                .sc-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 900;
                    color: #18181b;
                    text-align: center;
                    line-height: 1.2;
                    margin: 0 0 10px;
                }

                .sc-subtitle {
                    text-align: center;
                    font-size: 0.9375rem;
                    color: #71717a;
                    margin: 0 0 6px;
                    font-weight: 400;
                    line-height: 1.6;
                }
                .sc-detail {
                    text-align: center;
                    font-size: 0.8125rem;
                    color: #a1a1aa;
                    margin: 0;
                    line-height: 1.6;
                }

                /* Divider */
                .sc-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, #e4e4e7 30%, #e4e4e7 70%, transparent 100%);
                    margin: 28px 0;
                }

                /* Date card */
                .sc-date-card {
                    background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%);
                    border: 1px solid rgba(156,24,29,0.15);
                    border-radius: 20px;
                    padding: 24px;
                    text-align: center;
                    margin-bottom: 16px;
                    position: relative;
                    overflow: hidden;
                }
                .sc-date-card::before {
                    content: '';
                    position: absolute;
                    top: -20px; right: -20px;
                    width: 80px; height: 80px;
                    background: radial-gradient(circle, rgba(156,24,29,0.08) 0%, transparent 70%);
                    border-radius: 50%;
                }
                .sc-date-label {
                    font-size: 0.6875rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #9c181d;
                    margin: 0 0 10px;
                }
                .sc-date-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.625rem;
                    font-weight: 700;
                    color: #9c181d;
                    margin: 0 0 12px;
                }
                .sc-date-note {
                    font-size: 0.8125rem;
                    color: #c2410c;
                    margin: 0;
                    line-height: 1.5;
                }

                /* Steps card */
                .sc-steps-card {
                    background: #f8fdf9;
                    border: 1px solid rgba(134,239,172,0.4);
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 16px;
                }
                .sc-steps-title {
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #166534;
                    margin: 0 0 6px;
                    text-align: center;
                }
                .sc-steps-sub {
                    font-size: 0.8125rem;
                    color: #15803d;
                    margin: 0 0 20px;
                    text-align: center;
                    line-height: 1.5;
                }
                .sc-steps-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
                .sc-step {
                    background: rgba(255,255,255,0.8);
                    border: 1px solid rgba(134,239,172,0.3);
                    border-radius: 14px;
                    padding: 12px 10px;
                    text-align: center;
                }
                .sc-step-num {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #9c181d, #c0321a);
                    color: white;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .sc-step-name {
                    font-size: 0.6875rem;
                    font-weight: 600;
                    color: #166534;
                    display: block;
                    margin-bottom: 4px;
                }
                .sc-step-desc {
                    font-size: 0.6875rem;
                    color: #15803d;
                    line-height: 1.4;
                }

                /* Reference card */
                .sc-ref-card {
                    background: #fafafa;
                    border: 1px solid #e4e4e7;
                    border-radius: 16px;
                    padding: 16px 20px;
                    margin-bottom: 28px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .sc-ref-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: #f4f4f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .sc-ref-inner { min-width: 0; }
                .sc-ref-label {
                    font-size: 0.6875rem;
                    font-weight: 600;
                    color: #71717a;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 3px;
                }
                .sc-ref-value {
                    font-size: 0.75rem;
                    color: #52525b;
                    font-family: 'SF Mono', 'Fira Code', monospace;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: block;
                }

                /* Buttons */
                .sc-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px 28px;
                    background: linear-gradient(135deg, #9c181d 0%, #b01f25 100%);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 14px rgba(156,24,29,0.3);
                    text-decoration: none;
                }
                .sc-btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(156,24,29,0.35);
                    background: linear-gradient(135deg, #b01f25 0%, #9c181d 100%);
                }
                .sc-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 14px 28px;
                    background: transparent;
                    color: #9c181d;
                    border: 1.5px solid rgba(156,24,29,0.25);
                    border-radius: 14px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .sc-btn-secondary:hover {
                    background: #fef2f2;
                    border-color: rgba(156,24,29,0.4);
                }
                .sc-btn-row {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .sc-btn-whatsapp {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px 28px;
                    background: #25D366;
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 14px rgba(37,211,102,0.3);
                    text-decoration: none;
                }
                .sc-btn-whatsapp:hover {
                    background: #1ebe57;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(37,211,102,0.35);
                }

                .sc-footer-note {
                    text-align: center;
                    font-size: 0.75rem;
                    color: #a1a1aa;
                    margin: 24px 0 0;
                    line-height: 1.6;
                }

                /* Cal.com booking section */
                .sc-cal-wrap {
                    margin: 0 0 28px;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(156,24,29,0.2);
                }
                .sc-cal-header {
                    background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%);
                    padding: 20px 24px 16px;
                    border-bottom: 1px solid rgba(156,24,29,0.12);
                }
                .sc-cal-title {
                    margin: 0 0 4px;
                    font-size: 15px;
                    font-weight: 700;
                    color: #18181b;
                }
                .sc-cal-subtitle {
                    margin: 0;
                    font-size: 13px;
                    color: #71717a;
                    line-height: 1.5;
                }
                .sc-cal-embed-wrap {
                    min-height: 580px;
                    background: #fff;
                }
                .sc-booked-banner {
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                    border: 1px solid rgba(134,239,172,0.5);
                    border-radius: 16px;
                    padding: 20px 24px;
                    margin-bottom: 28px;
                    text-align: center;
                }
                .sc-booked-title {
                    margin: 0 0 4px;
                    font-size: 15px;
                    font-weight: 700;
                    color: #166534;
                }
                .sc-booked-sub {
                    margin: 0;
                    font-size: 13px;
                    color: #15803d;
                }

                /* Watermark logo */
                .sc-logo {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .sc-logo-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #9c181d;
                    color: white;
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }
                .sc-logo-dot {
                    width: 5px; height: 5px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.5);
                }

                /* Loading state */
                .sc-loading-body {
                    padding: 56px 40px;
                    text-align: center;
                }
                .sc-loading-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #18181b;
                    margin: 20px 0 10px;
                }
                .sc-loading-sub {
                    font-size: 0.875rem;
                    color: #a1a1aa;
                }

                @media (max-width: 480px) {
                    .sc-body { padding: 32px 24px 28px; }
                    .sc-title { font-size: 1.625rem; }
                    .sc-steps-grid { grid-template-columns: 1fr; }
                    .sc-btn-row { flex-direction: column; }
                    .sc-btn-primary, .sc-btn-secondary { width: 100%; }
                }
            `}</style>

            <div className="sc-root">
                <div className="sc-bg-blob sc-bg-blob-1" />
                <div className="sc-bg-blob sc-bg-blob-2" />

                {state === "loading" ? (
                    <div className={`sc-card loading-state`}>
                        <div className="sc-accent-bar" />
                        <div className="sc-loading-body">
                            <div className="sc-icon-wrap loading" style={{ margin: "0 auto 24px" }}>
                                <div className="sc-spinner" />
                            </div>
                            <div className="sc-loading-title">Confirmando tu pago</div>
                            <div className="sc-loading-sub">Esto puede tardar unos segundos…</div>
                        </div>
                    </div>
                ) : (
                    <div className={`sc-card ${visible ? "visible" : ""}`}>
                        <div className="sc-accent-bar" />
                        <div className="sc-body">

                            {/* Logo */}
                            <div className="sc-logo">
                                <span className="sc-logo-pill">
                                    LZ English Academy
                                    <span className="sc-logo-dot" />
                                    Método 590
                                </span>
                            </div>

                            {/* Icon */}
                            <div className={`sc-icon-wrap ${state}`}>
                                {state === "success" && (
                                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                )}
                                {state === "error" && (
                                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="sc-title">
                                {state === "success" ? "¡Pago confirmado!" : "No pudimos confirmar"}
                            </h1>
                            <p className="sc-subtitle">{message}</p>
                            {detail && <p className="sc-detail">{detail}</p>}

                            <div className="sc-divider" />

                            {/* Date */}
                            {state === "success" && formattedStartDate && (
                                <div className="sc-date-card">
                                    <p className="sc-date-label">Fecha oficial de inicio</p>
                                    <p className="sc-date-value">{formattedStartDate}</p>
                                    <p className="sc-date-note">
                                        Tu cupo está reservado. Las clases comienzan en la fecha indicada.
                                    </p>
                                </div>
                            )}

                            {/* Steps */}
                            {state === "success" && (
                                <div className="sc-steps-card">
                                    <p className="sc-steps-title">¡Tu inscripción quedó registrada!</p>
                                    <p className="sc-steps-sub">
                                        {contactMessage}
                                    </p>
                                    <div className="sc-steps-grid">
                                        <div className="sc-step">
                                            <div className="sc-step-num">1</div>
                                            <span className="sc-step-name">Confirmación</span>
                                            <span className="sc-step-desc">Pago validado correctamente</span>
                                        </div>
                                        <div className="sc-step">
                                            <div className="sc-step-num">2</div>
                                            <span className="sc-step-name">Contacto</span>
                                            <span className="sc-step-desc">Te escribimos por el medio registrado</span>
                                        </div>
                                        <div className="sc-step">
                                            <div className="sc-step-num">3</div>
                                            <span className="sc-step-name">Inicio</span>
                                            <span className="sc-step-desc">Acceso en tu fecha oficial de grupo</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cal.com booking — Premium pendiente */}
                            {isPremiumPending && (
                                <div className="sc-cal-wrap">
                                    <div className="sc-cal-header">
                                        <p className="sc-cal-title">Agenda tu primera clase</p>
                                        <p className="sc-cal-subtitle">
                                            Elige el horario que más te convenga. Los horarios se muestran en tu zona horaria.
                                        </p>
                                    </div>
                                    <div className="sc-cal-embed-wrap">
                                        <div id="cal-booking-embed" style={{ width: "100%", height: "580px" }} />
                                    </div>
                                </div>
                            )}

                            {/* Premium ya agendada */}
                            {state === "success" && userData?.plan === "Premium" && schedulingStatus === "completed" && (
                                <div className="sc-booked-banner">
                                    <p className="sc-booked-title">¡Tu clase ya está agendada!</p>
                                    <p className="sc-booked-sub">Recibirás un recordatorio por correo antes de tu sesión.</p>
                                </div>
                            )}

                            {/* Reference */}
                            {session_id && (
                                <div className="sc-ref-card">
                                    <div className="sc-ref-icon">
                                        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#a1a1aa" strokeWidth="1.5">
                                            <rect x="3" y="3" width="14" height="14" rx="3" />
                                            <path d="M7 7h6M7 10h6M7 13h4" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div className="sc-ref-inner">
                                        <span className="sc-ref-label">Referencia de pago</span>
                                        <span className="sc-ref-value">{session_id}</span>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="sc-btn-row">
                                {state === "success" && (
                                    <a
                                        href="https://chat.whatsapp.com/HhAvLoPoLwf1JsX0aWtnX1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sc-btn-whatsapp"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Unirme a la comunidad
                                    </a>
                                )}
                                <button onClick={() => router.push("/")} className="sc-btn-primary">
                                    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M3 10h14M10 3l7 7-7 7" />
                                    </svg>
                                    Volver al inicio
                                </button>
                                {state === "error" && (
                                    <button onClick={() => router.refresh()} className="sc-btn-secondary">
                                        Reintentar verificación
                                    </button>
                                )}
                            </div>

                            {state === "success" && (
                                <p className="sc-footer-note">
                                    ¿Necesitas ayuda? Escríbenos a{" "}
                                    <a href="mailto:info@lz-englishacademy.com" style={{ color: "#9c181d", fontWeight: 600, textDecoration: "none" }}>
                                        info@lz-englishacademy.com
                                    </a>
                                    {" "}y comparte tu referencia de pago.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SuccessContent;