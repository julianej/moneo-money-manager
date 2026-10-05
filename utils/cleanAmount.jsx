export function cleanAmount(value) {
  if (!value) {
    return null;
  }

  const amount = Number(
    String(value).trim().replace(",", ".")
  );

  return Number.isFinite(amount) ? amount : null;
}