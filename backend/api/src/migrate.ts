import "reflect-metadata";
import "dotenv/config";
import { Pool } from "pg";
import { REVIEW_SCHEMA_SQL } from "./review-schema.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL es obligatoria para ejecutar las migraciones.");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

try {
  await pool.query(REVIEW_SCHEMA_SQL);
  console.log("Migración de opiniones aplicada correctamente.");
} finally {
  await pool.end();
}
