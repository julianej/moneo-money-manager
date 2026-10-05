export function cleanAmount(value) {
  if (value === null || value === undefined) {
    return null;
  }

  let amount = String(value).trim();

  if (!amount) {
    return null;
  }

  amount = amount.replace(/\s/g, "");

  const lastComma = amount.lastIndexOf(",");
  const lastDot = amount.lastIndexOf(".");

  // Both separators exist
  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      // German format: 1.234,56
      amount = amount
        .replace(/\./g, "")
        .replace(",", ".");
    } else {
      // International format: 1,234.56
      amount = amount.replace(/,/g, "");
    }
  }

  // Only comma exists
  else if (lastComma !== -1) {
    amount = amount.replace(",", ".");
  }

  // Only dot exists
  // Leave it unchanged

  const parsed = Number(amount);

  return Number.isFinite(parsed) ? parsed : null;
}