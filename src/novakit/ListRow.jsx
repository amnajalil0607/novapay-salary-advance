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
      {isSelectable ? (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected ? "border-brand" : "border-neutral-300"
          }`}
          aria-hidden="true"
        >
          {selected ? (
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          ) : null}
        </span>
      ) : null}
    </>
  );

  if (isInteractive) {
    const stateClasses = isSelectable && selected
      ? "border-brand-200 bg-brand-50"
      : "border-neutral-200 bg-white";

    return (
      <button
        type="button"
        role={isSelectable ? "radio" : undefined}
        aria-checked={isSelectable ? selected : undefined}
        aria-expanded={interaction === "informational" ? expanded : undefined}
        aria-controls={interaction === "informational" ? controls : undefined}
        onClick={onClick}
        className={`w-full min-h-16 flex items-center gap-3 rounded-lg border px-4 py-4 text-left transition-[background-color,border-color,box-shadow] ${stateClasses} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${className}`}
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
