export function titleCase(text = "") {
  return text.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
