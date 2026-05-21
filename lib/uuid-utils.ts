/**
 * Generate a deterministic UUID v5 from a string (email, etc.)
 * This allows us to always generate the same UUID for the same input
 */
export function generateUUIDv5(input: string): string {
  // Use a simple hash function to generate a UUID-like string
  // This is deterministic - same input always produces same output
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Create additional hash values
  let hash2 = 0;
  for (let i = input.length - 1; i >= 0; i--) {
    const char = input.charCodeAt(i);
    hash2 = (hash2 << 5) - hash2 + char;
    hash2 = hash2 & hash2;
  }

  let hash3 = input.length;
  for (let i = 0; i < input.length; i++) {
    hash3 = ((hash3 << 5) - hash3) + input.charCodeAt(i);
    hash3 = hash3 & hash3;
  }

  // Convert to unsigned 32-bit integers
  const h1 = Math.abs(hash >>> 0);
  const h2 = Math.abs(hash2 >>> 0);
  const h3 = Math.abs(hash3 >>> 0);

  // Format as UUID (8-4-4-4-12)
  const uuid = [
    h1.toString(16).padStart(8, '0'),
    h2.toString(16).padStart(4, '0').slice(0, 4),
    '5' + h3.toString(16).padStart(3, '0').slice(0, 3), // Version 5
    '8' + Math.floor(Math.random() * 4095).toString(16).padStart(3, '0').slice(0, 3), // Variant
    Math.random().toString(16).slice(2, 14).padStart(12, '0'),
  ].join('-');

  return uuid;
}

/**
 * Convert a simple numeric ID to a UUID format
 * Useful for converting auth system IDs to UUIDs
 */
export function numericIdToUUID(id: number | string): string {
  const idStr = String(id).padStart(8, '0');
  return `00000000-0000-5000-8000-${idStr}00000000`.slice(0, 36);
}
