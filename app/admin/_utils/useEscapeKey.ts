import { useEffect } from "react";

// Ejecuta onEscape cuando el usuario presiona Esc. Se ata sólo mientras `active`
// sea true para no acumular listeners (modal cerrado = sin listener).
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}
