"use client";

import { useStartDates } from "@/app/hooks/useStartDates";

export default function NextStartBadge() {
    const { dates } = useStartDates();
    return <>{dates[0]?.label ?? "Próximamente"}</>;
}
