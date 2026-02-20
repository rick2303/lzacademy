"use client";

import { Suspense } from "react";
import SuccessContent from "./successContent";

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
