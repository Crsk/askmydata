import { createPool } from 'mysql2/promise'

export async function connect() {
  const connection = await createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    connectionLimit: 10
  })

  return connection
}