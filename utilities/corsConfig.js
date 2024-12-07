/**
 * Configuration object for CORS (Cross-Origin Resource Sharing).
 *
 * @property {string} origin - Specifies the allowed origin(s) for cross-origin requests. Use `"*"` to allow all origins.
 * @property {boolean} credentials - Indicates whether credentials (such as cookies or authorization headers) are allowed in requests.
 * @property {string[]} methods - An array of HTTP methods allowed for cross-origin requests (e.g., "GET", "POST", "PUT", "DELETE").
 */

export const corsConfig = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
