import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

const connectionUri = process.env.DATABASE_URL;

const pool =
  global.__mysqlPool ??
  mysql.createPool(
    connectionUri ??
      ({
        host: process.env.DB_HOST ?? "localhost",
        user: process.env.DB_USER ?? "root",
        password: process.env.DB_PASSWORD ?? "",
        database: process.env.DB_NAME ?? "gym_management",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        waitForConnections: true,
        connectionLimit: 10,
      } as mysql.PoolOptions),
  );

if (process.env.NODE_ENV !== "production") {
  global.__mysqlPool = pool;
}

export async function queryRows<T = RowDataPacket[]>(
  sql: string,
  values: Array<string | number | null> = [],
) {
  const [rows] = await pool.query<RowDataPacket[]>(sql, values);
  return rows as T;
}

export async function execute(
  sql: string,
  values: Array<string | number | null> = [],
) {
  const [result] = await pool.execute<ResultSetHeader>(sql, values);
  return result;
}

