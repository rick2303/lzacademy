// Colores semánticos por plan, compartidos entre páginas admin.
// Cada valor es una clase Tailwind de background (usar para puntos, barras, badges).
export const PLAN_COLORS: Record<string, string> = {
  Essential: "bg-blue-500",
  Premium: "bg-violet-500",
  Personalizado: "bg-emerald-500",
  Speaking: "bg-yellow-orange-500",
};

export function planColor(plan: string): string {
  return PLAN_COLORS[plan] ?? "bg-gray-400";
}
