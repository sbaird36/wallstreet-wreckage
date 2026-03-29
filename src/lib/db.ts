import { neon } from "@neondatabase/serverless";

/**
 * Neon serverless Postgres client.
 * Returns null if POSTGRES_URL is not configured (pre-deployment).
 */
const url = process.env.STORAGE_POSTGRES_URL ?? process.env.POSTGRES_URL;
const sql = url ? neon(url) : null;

export default sql;
