/**
 * AppBar — NovaKit Lite
 * title + optional back affordance
 */
export default function AppBar({
  title,
  onBack = null,
  variant = "default",
  showBrandMark = false,
}) {
  const isBrand = variant === "brand";

  return (
    <header
      className={`relative h-12 flex items-center gap-2 px-4 ${
        isBrand
          ? "border-b border-white/10 bg-transparent"
          : "border-b border-neutral-100 bg-white"
      }`}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className={`h-9 w-9 -ml-1 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isBrand
              ? "text-white active:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-brand"
              : "text-neutral-700 active:bg-neutral-100 focus-visible:ring-brand"
          }`}
        >
          ‹
        </button>
      ) : null}
      <h1
        className={`flex items-center gap-2 text-body font-semibold ${
          isBrand ? "text-white" : "text-neutral-900"
        } ${isBrand ? "" : "absolute left-1/2 -translate-x-1/2"}`}
      >
        {showBrandMark ? (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand text-[12px] font-bold text-white"
            aria-hidden="true"
          >
            N
          </span>
        ) : null}
        <span>{title}</span>
      </h1>
    </header>
  );
}
