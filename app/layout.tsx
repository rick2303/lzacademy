import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const BASE_URL = "https://lz-englishacademy.com";

// ─── Metadata base ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "LZ English Academy | Aprende inglés en 90 días",
    template: "%s | LZ English Academy",
  },
  description:
    "Aprende inglés en 90 días con el Método 590. Rutina de 5 sesiones diarias diseñada para construir fluidez real. Desde $10/mes.",
  icons: {
    icon: "/lzacademy_logo2.png",
    apple: "/lzacademy_logo2.png",
  },
  openGraph: {
    siteName: "LZ English Academy",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@lz_academym590",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─── Schema Organization ──────────────────────────────────────────────────────
function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LZ English Academy",
    alternateName: "Método 590",
    url: BASE_URL,
    logo: `${BASE_URL}/lzacademy_logo1.png`,
    description:
      "Academia de inglés online. El Método 590 convierte el inglés en una rutina diaria estructurada para construir fluidez real en 90 días.",
    foundingDate: "2021",
    founder: {
      "@type": "Person",
      name: "Loren Laínez",
      jobTitle: "Fundadora",
      sameAs: [
        "https://instagram.com/lz_academym590",
        "https://tiktok.com/@lore_lainez21",
      ],
    },
    sameAs: [
      "https://instagram.com/lz_academym590",
      "https://tiktok.com/@lore_lainez21",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@lz-englishacademy.com",
      contactType: "customer support",
      availableLanguage: "Spanish",
    },
    offers: {
      "@type": "Offer",
      name: "Plan Essential",
      price: "10",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <OrganizationSchema />
      </head>
      <body className="min-h-screen bg-white text-zinc-900 flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KQMHGX2CRD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KQMHGX2CRD');
          `}
        </Script>
      </body>
    </html>
  );
}