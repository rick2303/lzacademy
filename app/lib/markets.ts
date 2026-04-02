
export interface MarketTestimonial {
  quote: string;
  name: string;
  location: string;
}

export interface Market {
  slug: string; // usado en la URL: /mexico, /colombia, etc.
  name: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
  };
  hero: {
    pill: string;
    headline: string;
    headlineAccent: string;
    subheadline: string;
    ctaPrimary: string;
    stats: Array<{ value: string; label: string }>;
  };
  whySection: {
    title: string;
    points: string[];
  };
  testimonials: MarketTestimonial[];
  finalCta: {
    headline: string;
    body: string;
    button: string;
  };
  schema?: {
    areaServed: string;
    inLanguage?: string;
  };
}

export const markets: Market[] = [
  // ── MÉXICO ──────────────────────────────────────────────────────────────────
  {
    slug: "mexico",
    name: "México",
    seo: {
      title:
        "Aprende inglés para trabajar en empresa extranjera | LZ English Academy México",
      description:
        "¿Quieres trabajar en Amazon, Concentrix o cualquier empresa con sueldo en dólares? El Método 590 te lleva de cero a B1 conversacional en 90 días. Desde $10/mes.",
      keywords:
        "curso inglés para trabajar México, inglés para empresa extranjera, aprender inglés rápido México, método 590, inglés en dólares México",
      canonical: "https://lz-englishacademy.com/mexico",
    },
    hero: {
      pill: "Para estudiantes en México",
      headline: "Aprende inglés para",
      headlineAccent: "ganar en dólares.",
      subheadline:
        "Empresas como Amazon, Concentrix y Teleperformance pagan hasta 2x más a empleados bilingües. El Método 590 te da el nivel B1 que necesitas en 90 días — por $10/mes.",
      ctaPrimary: "Quiero empezar",
      stats: [
        { value: "$10 USD", label: "al mes" },
        { value: "≈ $170 MXN", label: "equivalente" },
        { value: "B1 en 90 días", label: "meta del método" },
      ],
    },
    whySection: {
      title: "¿Por qué el inglés cambia todo en México?",
      points: [
        "Las empresas transnacionales en México pagan entre 40% y 100% más a empleados bilingües.",
        "El trabajo remoto para empresas de EEUU desde México es la forma más rápida de aumentar ingresos sin emigrar.",
        "Call centers, soporte técnico y ventas internacionales requieren inglés B1 — exactamente lo que logras en 90 días.",
        "Con $10/mes inviertes menos que en un café y obtienes una habilidad que dura toda la vida.",
      ],
    },
    testimonials: [
      {
        quote:
          "Es un método en donde te acostumbras a la semana y se vuelve un hábito. En un mes tuve más avance que con otros cursos particulares.",
        name: "Valeria Aguilar",
        location: "México",
      },
      {
        quote:
          "Me ayudó a entender más la gramática. El ser algo que integras en tu día a día ayuda demasiado a adaptarte y entenderlo mejor, vale totalmente la pena.",
        name: "Mhia Olvera",
        location: "México",
      },
    ],
    finalCta: {
      headline: "Tu próximo trabajo puede ser en dólares.",
      body: "El único requisito es el inglés. El Método 590 te lo da en 90 días, desde $10/mes.",
      button: "Reservar mi cupo — $10/mes",
    },
    schema: { areaServed: "MX", inLanguage: "es-MX" },
  },

  // ── COLOMBIA ─────────────────────────────────────────────────────────────────
  {
    slug: "colombia",
    name: "Colombia",
    seo: {
      title:
        "Aprende inglés para trabajo remoto o viajar | LZ English Academy Colombia",
      description:
        "Inglés para trabajo remoto, visa a Canadá o EEUU, o nómada digital. El Método 590 te lleva a B1 conversacional en 90 días desde Colombia. Desde $10/mes.",
      keywords:
        "curso inglés trabajo remoto Colombia, inglés para viajar Colombia, aprender inglés rápido Colombia, método 590, nómada digital Colombia",
      canonical: "https://lz-englishacademy.com/colombia",
    },
    hero: {
      pill: "Para estudiantes en Colombia",
      headline: "Habla inglés para",
      headlineAccent: "trabajar remoto o viajar.",
      subheadline:
        "El inglés es el principal obstáculo para conseguir trabajo remoto en dólares o iniciar un proceso de visa. Con el Método 590 llegas a B1 conversacional en 3 meses — desde $10/mes.",
      ctaPrimary: "Iniciar proceso",
      stats: [
        { value: "$10 USD", label: "al mes" },
        { value: "≈ $41.000 COP", label: "equivalente" },
        { value: "B1 en 90 días", label: "meta del método" },
      ],
    },
    whySection: {
      title: "¿Por qué el inglés es urgente en Colombia ahora?",
      points: [
        "Colombia lidera el crecimiento de trabajo remoto en LATAM — y el inglés es el requisito #1 que los colombianos reportan como obstáculo.",
        "Los procesos de visa para Canadá y EEUU exigen demostrar nivel de inglés. B1 es el punto de entrada mínimo.",
        "Los nómadas digitales colombianos que hablan inglés ganan en promedio 3x más que quienes trabajan solo en español.",
        "Con $10/mes tienes acceso completo al método que llevó a Loren de cero a B1 en 90 días.",
      ],
    },
    testimonials: [
      {
        quote:
          "Aprendí a defenderme en inglés, puedo comunicar, realizar preguntas a otras personas y entender lo que me dicen. Super recomiendo este método.",
        name: "Brendalix Ortega",
        location: "Colombia",
      },
      {
        quote:
          "El método 590 me ayudó a aprender inglés después de años de intentar entender el idioma. Mejoró mi confianza y en un mes comencé a ver los cambios.",
        name: "Estudiante",
        location: "Colombia",
      },
    ],
    finalCta: {
      headline: "El trabajo remoto te espera. El inglés no.",
      body: "90 días, 5 sesiones al día, $10/mes. Así de concreto es el camino.",
      button: "Reservar mi cupo — $10/mes",
    },
    schema: { areaServed: "CO", inLanguage: "es-CO" },
  },

  // ── LATINOS EN EEUU ───────────────────────────────────────────────────────────
  {
    slug: "latinos-usa",
    name: "Latinos en EEUU",
    seo: {
      title: "Curso de inglés para hispanos en EEUU | LZ English Academy",
      description:
        "¿Entiendes inglés pero no hablas con confianza? El Método 590 está diseñado para hispanos en EEUU que necesitan mejorar su inglés en el trabajo. $10/mes.",
      keywords:
        "curso inglés para hispanos EEUU, inglés para latinos Estados Unidos, mejorar inglés trabajo hispanos, método 590, hablar inglés con confianza",
      canonical: "https://lz-englishacademy.com/latinos-usa",
    },
    hero: {
      pill: "Para hispanos en Estados Unidos",
      headline: "Tu inglés al",
      headlineAccent: "siguiente nivel. Finalmente.",
      subheadline:
        "Ya vives en EEUU pero el inglés te frena en el trabajo. El Método 590 está diseñado para hispanos que entienden pero no hablan con confianza — por $10/mes, menos que Netflix.",
      ctaPrimary: "Empezar ahora",
      stats: [
        { value: "$10 USD", label: "al mes" },
        { value: "Menos que Netflix", label: "en costo" },
        { value: "B1 en 90 días", label: "meta del método" },
      ],
    },
    whySection: {
      title: "El inglés que ya casi tienes.",
      points: [
        "Hay 62 millones de hispanos en EEUU. La mayoría entiende inglés pero no habla con la confianza necesaria para avanzar en su carrera.",
        "El entiendo pero no hablo' tiene solución: el Método 590 trabaja la producción oral (speaking) desde el día 1.",
        "Una promoción, un mejor trabajo, o simplemente comunicarte sin nervios — todo eso está del otro lado de 90 días de práctica.",
        "El método es completamente en español para que no haya barreras en el aprendizaje.",
      ],
    },
    testimonials: [
      {
        quote:
          "El método 590 me ha ayudado mucho a ser más fluida y mejorar mi confianza. Tener una rutina de estudio cada día hace que sea más fácil seguirla.",
        name: "Estudiante",
        location: "Estados Unidos",
      },
      {
        quote:
          "El método 590 es completo, refuerza conocimiento, lectura, escritura y speaking. El material es totalmente fácil de usar, me ha ayudado mucho.",
        name: "Estudiante",
        location: "Estados Unidos",
      },
    ],
    finalCta: {
      headline: "Ya entiendes inglés. Ahora aprende a hablarlo.",
      body: "5 sesiones diarias, rutina estructurada, speaking desde el día 1. Por $10/mes.",
      button: "Reservar mi cupo — $10/mes",
    },
    schema: { areaServed: "US", inLanguage: "es" },
  },

  // ── HONDURAS ──────────────────────────────────────────────────────────────────
  {
    slug: "honduras",
    name: "Honduras",
    seo: {
      title:
        "Aprende inglés rápido para estudiar en EEUU | LZ English Academy Honduras",
      description:
        "El Método 590 nació en Honduras. Loren Laínez aprendió de cero a B1 en 3 meses para estudiar en EEUU. Ahora tú puedes hacer lo mismo. $10/mes.",
      keywords:
        "aprender inglés Honduras, inglés para estudiar en EEUU Honduras, método 590 Honduras, curso inglés rápido Honduras",
      canonical: "https://lz-englishacademy.com/honduras",
    },
    hero: {
      pill: "El método que nació en Honduras",
      headline: "El inglés que cambió mi vida.",
      headlineAccent: "Ahora es tu turno.",
      subheadline:
        "Loren Laínez, fundadora del Método 590, es hondureña. Aprendió de cero a B1 en 3 meses para estudiar en EEUU. Su método ahora está disponible para que tú hagas lo mismo — desde $10/mes.",
      ctaPrimary: "Quiero iniciar",
      stats: [
        { value: "$10 USD", label: "al mes" },
        { value: "Hondureña", label: "fundadora" },
        { value: "B1 en 90 días", label: "meta del método" },
      ],
    },
    whySection: {
      title: "Una historia que empieza en Honduras.",
      points: [
        "Loren Laínez creció en Honduras y necesitaba inglés para cumplir su sueño de estudiar Ingeniería Biomédica en EEUU.",
        "Tenía 3 meses, partía de cero, y todas las academias le dijeron que era imposible. Diseñó su propio método basado en ciencia cognitiva.",
        "Hoy estudia en EEUU y enseña ese mismo método a estudiantes en más de 5 países.",
        "Parte de cada inscripción va a la Fundación LZ, que apoya la educación de niños en situación vulnerable en Honduras.",
      ],
    },
    testimonials: [
      {
        quote:
          "El curso 590 me ayudó a aprender inglés después de años de intentar entender el idioma. Mejoró mi confianza y en un mes comencé a ver los cambios.",
        name: "Mónica Alvarado",
        location: "Guatemala",
      },
      {
        quote:
          "Este curso me ayudó a mejorar y reforzar mi nivel A2. También hizo que en mi escuela entendiera fácilmente las clases de inglés.",
        name: "Sharick González",
        location: "Ecuador",
      },
    ],
    finalCta: {
      headline: "Tu historia puede cambiar igual que la de Loren.",
      body: "El Método 590 nació aquí, para personas como tú. $10/mes, 90 días, un camino real.",
      button: "Reservar mi cupo — $10/mes",
    },
    schema: { areaServed: "HN", inLanguage: "es-HN" },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getMarketBySlug(slug: string): Market | undefined {
  return markets.find((m) => m.slug === slug);
}

export function getAllMarketSlugs(): string[] {
  return markets.map((m) => m.slug);
}
