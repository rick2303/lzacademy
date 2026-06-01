// Helpers de fecha/hora en horario de California (Pacífico) para el portal admin.
// Todo el panel debe operar en PT sin importar la zona horaria del navegador del
// admin, así que estos helpers construyen la fecha/hora "ahora" en America/Los_Angeles.

const PT = "America/Los_Angeles";

function partsPT(date = new Date()): Record<string, string> {
    const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: PT,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hour12: false,
    });
    const out: Record<string, string> = {};
    for (const p of fmt.formatToParts(date)) out[p.type] = p.value;
    return out;
}

/** "Hoy" en PT como "YYYY-MM-DD". Sirve para `min` de inputs date y comparaciones. */
export function todayPT(date = new Date()): string {
    const p = partsPT(date);
    return `${p.year}-${p.month}-${p.day}`;
}

/** "Ahora" en PT como "YYYY-MM-DDTHH:mm". Sirve para `min` de inputs datetime-local. */
export function nowPTInput(date = new Date()): string {
    const p = partsPT(date);
    const hour = p.hour === "24" ? "00" : p.hour; // algunos motores emiten "24" a medianoche
    return `${p.year}-${p.month}-${p.day}T${hour}:${p.minute}`;
}
