export function cleanTitle(title) {
  // title is empty/falsy OR …"  ||  Is title NOT a string?
  if (!title || typeof title !== "string") {
    return "";
  }

  return title
    .split("*")[0]
    // .slice(0, 20)
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