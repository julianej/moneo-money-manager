export function cleanCategory(category) {
  if (!category || typeof category !== "string") {
    return "";
  }

  return category
    .replace(/\s+/g, " ")
    .trim();
}

export function isValidCategory(category) {
  const value = cleanCategory(category);

  return (
    value.length >= 3 &&
    value.length <= 30
  );
}

export function categoryExists(categories, category) {
  const value = cleanCategory(category).toLowerCase();

  return categories.some(
    (item) => item.toLowerCase() === value
  );
}