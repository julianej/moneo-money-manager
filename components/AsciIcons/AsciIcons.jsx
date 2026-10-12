
export default function AsciiIcon({ symbol, label }) {
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        fontFamily: "IBM Plex Mono, monospace",
        fontWeight: 600,
        fontSize: "0.85rem",
        lineHeight: 1,
        letterSpacing: "-0.05em",
      }}
    >
      {symbol}
    </span>
  );
}
