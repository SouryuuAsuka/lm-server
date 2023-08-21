const PostgresqlOrgRepository = require('@database/postgresql/PostgresqlOrgRepository');

module.exports = class PostgresqlDatabaseService {
  constructor() {
    this.pool = new Pool({
      user: process.env.POSTGRESQL_USER,
      database: process.env.POSTGRESQL_DATABASE,
      password: process.env.POSTGRESQL_PASSWORD,
      port: 5432,
      host: '172.17.0.1',
    })
    this.orgRepository = new PostgresqlOrgRepository(this.pool);
  }

};