"use client";

import { useEffect, useState } from "react";

export interface StartDate {
  value: string;
  label: string;
  enabled: boolean;
  special?: boolean;
  excludedPlans?: string[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export function useStartDates() {
  const [dates, setDates] = useState<StartDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/config/start-dates`)
      .then((r) => r.json())
      .then((data) => { setDates(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // "Hoy" en la zona horaria local del usuario (YYYY-MM-DD). Usamos la zona del
  // navegador (sin timeZone) para que cada fecha de inicio siga disponible todo su
  // día local —hasta las 11:59pm del usuario— y desaparezca recién al pasar a la
  // medianoche local. Antes se calculaba con toISOString() (UTC), lo que cortaba
  // las fechas a destiempo según la zona horaria del usuario.
  const todayLocal = new Intl.DateTimeFormat("sv-SE").format(new Date());
  // Orden ascendente por fecha (YYYY-MM-DD) para que [0] sea siempre la más cercana.
  const availableDates = dates
    .filter((d) => d.value >= todayLocal)
    .sort((a, b) => a.value.localeCompare(b.value));

  // Current calendar month in PT — used by form date pickers
  const currentMonthPT = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Los_Angeles" })
    .format(new Date())
    .slice(0, 7); // "YYYY-MM"
  const datesCurrentMonth = availableDates.filter((d) => d.value.startsWith(currentMonthPT));

  return { dates: availableDates, datesCurrentMonth, loading };
}
