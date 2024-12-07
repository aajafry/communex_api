import mongoose from "mongoose";

const dbUrl = process.env.DB_ENDPOINT;

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * @param {string} [databaseUrl=dbUrl] - The MongoDB connection string. Defaults to the `DB_ENDPOINT` environment variable.
 * @throws {Error} Logs an error message if the database connection fails.
 * @returns {void} Logs a success message if the connection is successful.
 */
export const connectDatabase = (databaseUrl = dbUrl) => {
  mongoose
    .connect(databaseUrl, {})
    .then(() => console.log("Database connection successful"))
    .catch((error) => console.error(error.message));
};
