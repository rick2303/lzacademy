import { ImageResponse } from "next/og";
import { getMarketBySlug } from "../lib/markets";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
    params,
}: {
    params: Promise<{ mercado: string }>;
}) {
    const { mercado } = await params;
    const market = getMarketBySlug(mercado);

    // Fallback si el mercado no existe
    const headline = market?.hero.headline ?? "Aprende inglés";
    const accent = market?.hero.headlineAccent ?? "en 90 días.";
    const pill = market?.hero.pill ?? "LZ English Academy";
    const stat1 = market?.hero.stats[0];
    const stat2 = market?.hero.stats[1];
    const stat3 = market?.hero.stats[2];

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
                {/* Banda superior */}
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
                        top: "-80px",
                        right: "-80px",
                        width: "360px",
                        height: "360px",
                        borderRadius: "50%",
                        background: "rgba(156,24,29,0.06)",
                    }}
                />

                {/* Pill del mercado */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "20px",
                        background: "#fef2f2",
                        border: "1px solid #fca5a5",
                        borderRadius: "999px",
                        padding: "6px 16px",
                        width: "fit-content",
                    }}
                >
                    <div
                        style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#9c181d",
                        }}
                    />
                    <span style={{ fontSize: "16px", color: "#9c181d", fontWeight: 600 }}>
                        {pill}
                    </span>
                </div>

                {/* Headline */}
                <div
                    style={{
                        fontSize: "68px",
                        fontWeight: 800,
                        color: "#18181b",
                        lineHeight: 1.1,
                        marginBottom: "20px",
                    }}
                >
                    <span>{headline}</span>
                    <br />
                    <span style={{ color: "#9c181d" }}>{accent}</span>
                </div>

                {/* Subheadline */}
                <div
                    style={{
                        fontSize: "24px",
                        color: "#71717a",
                        marginBottom: "48px",
                    }}
                >
                    Método 590 · lz-englishacademy.com
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            background: "#9c181d",
                            borderRadius: "10px",
                            padding: "8px 16px",
                            color: "#ffffff",
                            fontSize: "18px",
                            fontWeight: 700,
                            display: "flex",
                        }}
                    >
                        LZ English Academy
                    </div>

                    {/* Stats del mercado */}
                    <div style={{ display: "flex", gap: "28px" }}>
                        {[stat1, stat2, stat3].filter(Boolean).map((s) => (
                            <div
                                key={s!.label}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    background: "#fafafa",
                                    border: "1px solid #e4e4e7",
                                    borderRadius: "12px",
                                    padding: "10px 20px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: 800,
                                        color: "#18181b",
                                    }}
                                >
                                    {s!.value}
                                </span>
                                <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
                                    {s!.label}
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