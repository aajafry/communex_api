import { v2 as cloudinary } from "cloudinary";

/**
 * Configures the Cloudinary SDK with credentials from environment variables.
 *
 * @throws {Error} If any required environment variables are not set.
 * @returns {void}
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
