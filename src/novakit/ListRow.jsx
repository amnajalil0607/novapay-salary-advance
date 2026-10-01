/**
 * ListRow / TransactionRow — NovaKit Lite
 * leading icon · title + subtitle · trailing amount
 */
export default function ListRow({
  icon = null,
  title,
  subtitle,
  trailing = null,
  interaction = "static",
  selected = false,
  expanded,
  controls,
  onClick,
  className = "",
}) {
  const isInteractive = interaction !== "static";
  const isSelectable = interaction === "selectable";

  const content = (
    <>
      {icon ? (
        <div
          className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0"
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="text-body text-neutral-900">{title}</div>
        {subtitle ? (
          <div className={`text-caption ${isInteractive ? "text-neutral-700" : "text-neutral-500"}`}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </>
  );

  if (isInteractive) {
    const stateClasses = isSelectable && selected
      ? "border-brand bg-brand-50 ring-1 ring-brand"
      : "border-neutral-300 bg-white";

    return (
      <button
        type="button"
        role={isSelectable ? "radio" : undefined}
        aria-checked={isSelectable ? selected : undefined}
        aria-expanded={interaction === "informational" ? expanded : undefined}
        aria-controls={interaction === "informational" ? controls : undefined}
        onClick={onClick}
        className={`w-full flex items-center gap-3 rounded-md border px-3 py-3 text-left transition-colors ${stateClasses} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={
        "flex items-center gap-3 py-3 border-b border-[#DADADA] last:border-b-0 " +
        className
      }
    >
      {content}
    </div>
  );
}
