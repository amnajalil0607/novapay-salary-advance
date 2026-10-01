/**
 * AppBar — NovaKit Lite
 * title + optional back affordance
 */
export default function AppBar({ title, onBack = null }) {
  return (
    <header className="h-14 flex items-center gap-2 px-3 border-b border-neutral-100 bg-white">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="h-9 w-9 -ml-1 flex items-center justify-center rounded-full text-neutral-700 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          ‹
        </button>
      ) : null}
      <h1 className="text-title text-neutral-900">{title}</h1>
    </header>
  );
}
