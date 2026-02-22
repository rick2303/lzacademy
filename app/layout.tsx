import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  icons: {
    icon: "/lzacademy_logo2.png",
    apple: "/lzacademy_logo2.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
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