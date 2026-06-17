"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { planPriceDisplay } from "@/app/lib/plans";

// id/label/route son específicos de esta navegación; el precio sale del catálogo único.
const allPlans = [
  { id: "essential",    label: "Essential",    price: `${planPriceDisplay("Essential")}/mes`,     route: "/essential" },
  { id: "premium",      label: "Premium",      price: `${planPriceDisplay("Premium")}/mes`,       route: "/premium" },
  { id: "personalizada",label: "Personalizado", price: `${planPriceDisplay("Personalizado")}/mes`, route: "/personalizado" },
];

interface Props {
  currentPlan: "essential" | "premium" | "personalizada";
  nivel: string;
}

export default function PlanSwitcher({ currentPlan, nivel }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const otherPlans = allPlans.filter((p) => p.id !== currentPlan);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleSelect(route: string) {
    setOpen(false);
    router.push(`${route}?nivel=${encodeURIComponent(nivel)}`);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-[14px] lg:text-[15px] font-bold text-zinc-600 bg-white shadow-sm transition hover:shadow-md active:scale-95"
        style={{ border: "1.5px solid #d4d4d4" }}
      >
        Cambiar plan
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl z-20 overflow-hidden"
          style={{ border: "1.5px solid #e8adb0", minWidth: "220px" }}
        >
          {otherPlans.map((plan, i) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleSelect(plan.route)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-left transition hover:bg-[#fadadd] active:scale-95"
              style={{ borderTop: i > 0 ? "1px solid #f0c8cc" : undefined }}
            >
              <span className="text-[14px] font-extrabold text-zinc-800">{plan.label}</span>
              <span className="text-[13px] font-bold ml-4" style={{ color: "#C0353E" }}>{plan.price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
