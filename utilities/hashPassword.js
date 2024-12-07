import bcrypt from "bcrypt";

/**
 * Hashes a plain-text password using bcrypt.
 *
 * @async
 * @param {string} password - The plain-text password to hash.
 * @returns {Promise<string>} The hashed password.
 * @throws {Error} Throws an error if the password is not provided.
 */
export const hashPassword = async (password) => {
  if (!password) throw new Error("Password is required");
  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds.
  return await bcrypt.hash(password, salt); // Hash the password with the generated salt.
};
