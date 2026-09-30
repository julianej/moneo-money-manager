function isValidTitle(title) {
  return (
    typeof title === "string" &&
    title.trim().length >= 3
  );
}

function cleanTitle(title) {
  if (!title || typeof title !== "string") {
    return "";
  }

  return title
    .replace(/[^A-Za-zÄÖÜäöüß0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const requiredHeaders = [
  "date",
  "title",
  "amount",
];

function parseAmount(value) {
  if (!value) {
    return 0;
  }

  return Number(
    value
      .trim()
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const [day, month, year] = value.trim().split(".");

  return `${year}-${month}-${day}`;
}