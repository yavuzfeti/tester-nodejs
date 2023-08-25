import pg from "pg"

const postgresClient = new pg.Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'nodejsdb',
  password: '1010',
  port: 5432,
})

export default postgresClient