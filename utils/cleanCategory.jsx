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

export function categoryExists(categories, categoryName) {
  const value = cleanCategory(categoryName).toLowerCase();

  return categories.some((item) => {
    const name =
      typeof item === "string"
        ? item
        : item.category;

    return name?.toLowerCase() === value;
  });
}