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

  const today = new Date();
  today.setDate(today.getDate() - 1);
  const yesterday = today.toISOString().split("T")[0];
  const availableDates = dates.filter((d) => d.value > yesterday);

  // Current calendar month in PT — used by form date pickers
  const currentMonthPT = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Los_Angeles" })
    .format(new Date())
    .slice(0, 7); // "YYYY-MM"
  const datesCurrentMonth = availableDates.filter((d) => d.value.startsWith(currentMonthPT));

  return { dates: availableDates, datesCurrentMonth, loading };
}
