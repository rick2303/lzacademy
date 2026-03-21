import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LZ English Academy — Método 590";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "80px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    position: "relative",
                }}
            >
                {/* Fondo rojo sutil arriba */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "6px",
                        background: "#9c181d",
                    }}
                />

                {/* Fondo decorativo */}
                <div
                    style={{
                        position: "absolute",
                        top: "-100px",
                        right: "-100px",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "rgba(156,24,29,0.06)",
                    }}
                />

                {/* Badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#22c55e",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "18px",
                            color: "#52525b",
                            fontWeight: 600,
                        }}
                    >
                        Inscripciones abiertas
                    </span>
                </div>

                {/* Headline */}
                <div
                    style={{
                        fontSize: "72px",
                        fontWeight: 800,
                        color: "#18181b",
                        lineHeight: 1.1,
                        marginBottom: "24px",
                    }}
                >
                    <span>Aprende inglés</span>
                    <br />
                    <span style={{ color: "#9c181d" }}>en 90 días.</span>
                </div>

                {/* Subheadline */}
                <div
                    style={{
                        fontSize: "26px",
                        color: "#71717a",
                        marginBottom: "48px",
                        maxWidth: "700px",
                        lineHeight: 1.4,
                    }}
                >
                    El Método 590 · 5 sesiones diarias · Desde $10/mes
                </div>

                {/* Footer de la imagen */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo texto */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                background: "#9c181d",
                                borderRadius: "10px",
                                padding: "8px 16px",
                                color: "#ffffff",
                                fontSize: "20px",
                                fontWeight: 700,
                            }}
                        >
                            LZ English Academy
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: "32px" }}>
                        {[
                            { value: "19", label: "países" },
                            { value: "90", label: "días" },
                            { value: "B1", label: "nivel meta" },
                        ].map((s) => (
                            <div
                                key={s.label}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "32px",
                                        fontWeight: 800,
                                        color: "#18181b",
                                    }}
                                >
                                    {s.value}
                                </span>
                                <span style={{ fontSize: "14px", color: "#a1a1aa" }}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        { ...size },
    );
}