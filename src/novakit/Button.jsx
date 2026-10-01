/**
 * Button — NovaKit Lite
 * Variants: primary | secondary
 * Sizes: md | lg
 * States: default, pressed (active), disabled
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors select-none w-full " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

  const sizes = {
    md: "h-11 px-4 text-body",
    lg: "h-14 px-5 text-title",
  };

  const variants = {
    primary:
      "bg-brand text-white active:bg-brand-pressed disabled:bg-neutral-300 disabled:text-neutral-500",
    secondary:
      "bg-white text-neutral-700 border border-neutral-300 active:bg-neutral-100 disabled:text-neutral-300",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
