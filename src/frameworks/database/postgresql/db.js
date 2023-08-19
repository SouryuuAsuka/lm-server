const  Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.POSTGRESQL_USER,
  database: process.env.POSTGRESQL_DATABASE,
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432,
  host: '172.17.0.1',
})

module.exports = pool ;