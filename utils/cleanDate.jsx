export function cleanDate(date) {
  if (!date) {
    return null;
  }

  const trimmedDate = String(date).trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
    return trimmedDate;
  }

  // DD.MM.YYYY
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmedDate)) {
    const [day, month, year] = trimmedDate.split(".");
    return `${year}-${month}-${day}`;
  }

  // YYYYMMDD
  if (/^\d{8}$/.test(trimmedDate)) {
    const year = trimmedDate.slice(0, 4);
    const month = trimmedDate.slice(4, 6);
    const day = trimmedDate.slice(6, 8);

    return `${year}-${month}-${day}`;
  }

  return null;
}