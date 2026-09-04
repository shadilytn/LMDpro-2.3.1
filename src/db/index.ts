import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema';

// Global connection pool caching to survive hot-reload events in Vite / Node development
declare global {
  var _postgresPool: InstanceType<typeof Pool> | undefined;
}

export const isDatabaseConfigured = (): boolean => {
  return Boolean(
    process.env.SQL_HOST &&
    process.env.SQL_HOST.trim().length > 0 &&
    process.env.SQL_USER &&
    process.env.SQL_PASSWORD &&
    process.env.SQL_DB_NAME
  );
};

export const createPool = () => {
  if (!isDatabaseConfigured()) {
    // Return a dummy pool that resolves safely without logging noisy errors or terminating
    return {
      query: async () => {
        return { rows: [] };
      },
      on: () => {},
      end: async () => {},
    } as any;
  }
  if (!globalThis._postgresPool) {
    try {
      globalThis._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        max: 10,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
      });

      // Handle unexpected idle pool errors gracefully
      globalThis._postgresPool.on('error', (err: Error) => {
        console.warn('[SQL Pool] Idle client notice (auto-recovering):', err.message);
      });
    } catch (err: any) {
      console.warn('[SQL Pool] Initialization notice:', err.message);
      return {
        query: async () => ({ rows: [] }),
        on: () => {},
        end: async () => {},
      } as any;
    }
  }
  return globalThis._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });

