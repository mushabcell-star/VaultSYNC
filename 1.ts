import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Setup koneksi database PostgreSQL menggunakan Pool
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});