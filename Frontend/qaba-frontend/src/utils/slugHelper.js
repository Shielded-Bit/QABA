/**
 * Creates a URL-friendly slug from a property title and ID
 * @param {string} title - The property title
 * @param {number|string} id - The property ID
 * @returns {string} - The formatted slug (e.g., "luxury-apartment-123")
 */
export const createPropertySlug = (title, id) => {
  if (!title || !id) return String(id); // Fallback to just ID if title is missing

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  return `${slug}-${id}`;
};

/**
 * Extracts the property ID from a slug
 * @param {string} slug - The slug (e.g., "luxury-apartment-123")
 * @returns {string} - The property ID
 */
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;

  const parts = slug.split('-');
  return parts[parts.length - 1];
};
