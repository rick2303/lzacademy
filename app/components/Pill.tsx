export default
    function Pill({
        children,
        tone = "falu",
    }: {
        children: React.ReactNode;
        tone?: "falu" | "orange" | "neutral";
    }) {
    const styles =
        tone === "orange"
            ? "bg-yellow-orange-50 text-yellow-orange-900 ring-yellow-orange-200"
            : tone === "falu"
                ? "bg-falu-red-50 text-falu-red-900 ring-falu-red-200"
                : "bg-zinc-50 text-zinc-700 ring-zinc-200";

    return (
        <span
            className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                styles,
            ].join(" ")}
        >
            {children}
        </span>
    );
}
