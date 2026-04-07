"use client";

import { useEffect, useState } from "react";

export interface StartDate {
  value: string;
  label: string;
  enabled: boolean;
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

  // Misma lógica que antes: filtra fechas pasadas según timezone del usuario
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const yesterday = today.toISOString().split("T")[0];
  const availableDates = dates.filter((d) => d.value > yesterday);

  return { dates: availableDates, loading };
}
