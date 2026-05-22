import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | LZ English Academy",
  description:
    "Términos y Condiciones de uso de LZ English Academy y del Método 590: planes y cobros, acceso y cohortes, cancelación, propiedad intelectual, conducta, responsabilidad, ley aplicable y contacto.",
  alternates: { canonical: "https://lz-englishacademy.com/terminos" },
  openGraph: {
    title: "Términos y Condiciones | LZ English Academy",
    description:
      "Términos y Condiciones de uso de LZ English Academy y del Método 590.",
    url: "https://lz-englishacademy.com/terminos",
  },
};

export default function TerminosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
