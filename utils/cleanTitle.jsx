export function cleanTitle(title) {
  if (!title || typeof title !== "string") {
    return "";
  }

  return title
    .replace(/[^A-Za-zÄÖÜäöüß0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isValidTitle(title) {
  return (
    typeof title === "string" &&
    title.trim().length >= 3
  );
}