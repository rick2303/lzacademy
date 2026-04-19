import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "LZ English Academy | Aprende inglés rápido y con propósito",
  description:
    "Aprende inglés en 90 días con LZ English Academy usando el Método 590. Sesiones diarias, speaking real y planes Essential y Premium adaptados a tu nivel.",
  alternates: {
    canonical: "https://lz-englishacademy.com/",
  },
  openGraph: {
    title: "LZ English Academy | Aprende inglés rápido y con propósito",
    description:
      "Transforma tu inglés en 90 días con el Método 590: sesiones guiadas, speaking real y planes adaptados a tu nivel.",
    url: "https://lz-englishacademy.com/",
    images: [{ url: "https://lz-englishacademy.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    title: "LZ English Academy | Aprende inglés rápido y con propósito",
    description:
      "Transforma tu inglés en 90 días con el Método 590: sesiones guiadas, speaking real y planes adaptados a tu nivel.",
    images: ["https://lz-englishacademy.com/og-image.jpg"],
  },
};

export default function Page() {
  return <HomeClient />;
}
