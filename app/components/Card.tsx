export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5",
        "transition hover:shadow-md hover:-translate-y-0.5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}