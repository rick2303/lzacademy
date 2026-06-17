// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO ÚNICO DE PLANES — fuente de verdad del frontend.
//
// Todo lo estructural de los planes (precio, recurrencia, agendamiento, niveles,
// colores, imagen, en qué dropdowns aparece) se define AQUÍ y el resto del código
// lo deriva. Para agregar o modificar un plan, edita este archivo.
//
// El backend tiene su propio catálogo (lzacademy-backend/src/config/plans.js) que
// es la fuente de verdad para COBRAR. Este de aquí cubre la presentación. El
// precio debe coincidir con el del backend; si quieres evitar la duplicación,
// el endpoint público GET /config/plans expone el catálogo del backend.
//
// La copy de marketing por página (features, taglines, textos de las landing de
// cada plan) sigue viviendo en cada página, porque difiere entre páginas.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanKey = "Essential" | "Premium" | "Personalizado" | "Speaking";
export type DiscountPlan = "all" | PlanKey;

export interface PlanChip {
  color: string;
  bg: string;
  border: string;
}

export interface PlanDef {
  key: PlanKey;
  label: string;
  priceCents: number;
  recurring: boolean;          // true = suscripción cada 4 semanas; false = pago único
  requiresScheduling: boolean; // true = agenda 1ª clase tras pagar (Premium)
  hasLevels: boolean;          // participa en la matriz de niveles / accesos
  checkout: boolean;           // seleccionable en los dropdowns de checkout y /pago-estudiantes
  character?: string;          // imagen del personaje (paso-cuatro)
  adminColor: string;          // clase Tailwind de background (punto/barra en admin)
  badgeClass: string;          // clases Tailwind bg+text para chips/badges en admin
  chip?: PlanChip;             // colores hex (chip de plan en /success)
  levelAvailability?: Record<string, boolean>; // defaults de niveles (solo hasLevels)
  // Resumen del plan en el checkout: tagline + bullets. Se muestra en el formulario
  // de pago y se envía como descripción del producto en Stripe (ambos flujos).
  checkoutTagline?: string;
  checkoutFeatures?: string[];
}

// Defaults de disponibilidad de niveles: Essential todo; Premium sin B2.2;
// Personalizado sin B2.1 ni B2.2. (Fallback si el backend no responde.)
const ALL_LEVELS_ON = {
  Principiante: true, Basico: true, Intermedio: true,
  "Intermedio alto-gramatica": true, "Intermedio alto-produccion": true,
};

export const PLAN_LIST: PlanDef[] = [
  {
    key: "Essential",
    label: "Essential",
    priceCents: 1000,
    recurring: true,
    requiresScheduling: false,
    hasLevels: true,
    checkout: true,
    character: "/muñeca-essential.webp",
    adminColor: "bg-blue-500",
    badgeClass: "bg-sky-100 text-sky-700",
    chip: { color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
    levelAvailability: { ...ALL_LEVELS_ON },
    checkoutTagline: "Aprende a tu ritmo con el Método 590 completo.",
    checkoutFeatures: [
      "Acceso completo al Método 590",
      "Plataforma con material organizado por sesión y nivel",
      "Comunidad en WhatsApp",
      "Clases de práctica en vivo los viernes",
    ],
  },
  {
    key: "Premium",
    label: "Premium",
    priceCents: 5000,
    recurring: true,
    requiresScheduling: true,
    hasLevels: true,
    checkout: true,
    character: "/muñeca-premium.webp",
    adminColor: "bg-violet-500",
    badgeClass: "bg-violet-100 text-violet-700",
    chip: { color: "#7c3aed", bg: "#faf5ff", border: "#ddd6fe" },
    levelAvailability: { ...ALL_LEVELS_ON, "Intermedio alto-produccion": false },
    checkoutTagline: "Todo lo de Essential, con clases diarias en vivo.",
    checkoutFeatures: [
      "Todo lo del Plan Essential",
      "1 hora de clase diaria (lunes a jueves)",
      "Repasos los viernes para resolver dudas",
      "Práctica hablada diaria y acompañamiento constante",
    ],
  },
  {
    key: "Personalizado",
    label: "Personalizado",
    priceCents: 12000,
    recurring: false,
    requiresScheduling: false,
    hasLevels: true,
    checkout: true,
    character: "/muñeca-personalizada.webp",
    adminColor: "bg-emerald-500",
    badgeClass: "bg-falu-red-100 text-falu-red-700",
    chip: { color: "#9c181d", bg: "#fef2f2", border: "#ffc9cb" },
    levelAvailability: { ...ALL_LEVELS_ON, "Intermedio alto-gramatica": false, "Intermedio alto-produccion": false },
    checkoutTagline: "Acompañamiento 1:1 totalmente a tu medida.",
    checkoutFeatures: [
      "Todo lo del Plan Premium",
      "2 sesiones privadas 1:1 por semana adaptadas a ti",
      "1 sesión de práctica grupal cada viernes",
      "Acceso completo al Método 590",
      "Horario flexible para tus sesiones privadas",
      "Plan de trabajo personalizado desde el día 1",
      "Corrección y feedback en tiempo real",
      "Seguimiento y motivación constante",
      "Avanza a tu ritmo con guía personalizada",
    ],
  },
  {
    key: "Speaking",
    label: "Speaking",
    priceCents: 3000,
    recurring: false,
    requiresScheduling: false,
    hasLevels: false,
    checkout: false,
    adminColor: "bg-yellow-orange-500",
    badgeClass: "bg-yellow-orange-100 text-yellow-orange-700",
  },
];

export const PLAN_MAP: Record<string, PlanDef> = Object.fromEntries(
  PLAN_LIST.map((p) => [p.key, p])
);

// ── Listas derivadas ─────────────────────────────────────────────────────────
export const ALL_PLAN_KEYS = PLAN_LIST.map((p) => p.key);
export const CHECKOUT_PLAN_KEYS = PLAN_LIST.filter((p) => p.checkout).map((p) => p.key);
export const LEVELED_PLAN_KEYS = PLAN_LIST.filter((p) => p.hasLevels).map((p) => p.key);
export const SUBSCRIPTION_PLANS = PLAN_LIST.filter((p) => p.recurring).map((p) => p.key);
// Planes que aceptan códigos de descuento: pago único y disponibles en checkout
// (debe coincidir con el backend → discount.service.js / DISCOUNTS_FOR_SUBSCRIPTIONS).
export const DISCOUNTABLE_PLANS = PLAN_LIST.filter((p) => !p.recurring && p.checkout).map((p) => p.key);
// Opciones de plan para un código de descuento en el admin ("all" + planes de checkout).
export const DISCOUNT_PLAN_OPTIONS: DiscountPlan[] = ["all", ...CHECKOUT_PLAN_KEYS];

// Matriz de niveles por plan (defaults) para useLevelAvailability.
export const DEFAULT_LEVEL_AVAILABILITY: Record<string, Record<string, boolean>> =
  Object.fromEntries(
    LEVELED_PLAN_KEYS.map((k) => [k, { ...(PLAN_MAP[k].levelAvailability as Record<string, boolean>) }])
  );

// ── Helpers ──────────────────────────────────────────────────────────────────
export function getPlan(key: string): PlanDef | undefined {
  return PLAN_MAP[key];
}
export function planPriceDisplay(key: string): string {
  const p = PLAN_MAP[key];
  return p ? `$${Math.round(p.priceCents / 100)}` : "";
}
export function isSubscriptionPlan(key: string): boolean {
  return !!PLAN_MAP[key]?.recurring;
}
// true = el plan agenda su primera clase tras pagar (p. ej. Premium).
export function requiresScheduling(key: string): boolean {
  return !!PLAN_MAP[key]?.requiresScheduling;
}
export function isDiscountablePlan(key: string): boolean {
  return DISCOUNTABLE_PLANS.includes(key as PlanKey);
}
// Color (clase Tailwind bg) por plan, con fallback gris seguro.
export function planColor(key: string): string {
  return PLAN_MAP[key]?.adminColor ?? "bg-gray-400";
}
// Clases de chip/badge (bg+text) por plan, con fallback gris seguro.
export function planBadgeClass(key: string): string {
  return PLAN_MAP[key]?.badgeClass ?? "bg-gray-100 text-gray-700";
}
export function planLabel(key: string): string {
  return PLAN_MAP[key]?.label ?? key;
}
// Tagline y bullets del plan para el resumen del checkout.
export function checkoutTagline(key: string): string {
  return PLAN_MAP[key]?.checkoutTagline ?? "";
}
export function checkoutFeatures(key: string): string[] {
  return PLAN_MAP[key]?.checkoutFeatures ?? [];
}
// Descripción del producto que se envía a Stripe ("Incluye: a · b · c").
export function checkoutDescription(key: string): string {
  const feats = checkoutFeatures(key);
  return feats.length ? `Incluye: ${feats.join(" · ")}` : "";
}
