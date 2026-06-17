// Colores semánticos por plan, compartidos entre páginas admin.
// La fuente de verdad es el catálogo único de planes (app/lib/plans.ts);
// este archivo se mantiene como punto de import estable para el admin.
import { PLAN_LIST, planColor as planColorFromCatalog } from "@/app/lib/plans";

export const PLAN_COLORS: Record<string, string> = Object.fromEntries(
  PLAN_LIST.map((p) => [p.key, p.adminColor])
);

export function planColor(plan: string): string {
  return planColorFromCatalog(plan);
}
