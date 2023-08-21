const PostgresqlDatabaseServices = require('@database/postgresql/PostgresqlDatabaseService');

module.exports = (() => {
  return {
    DatabaseService: new PostgresqlDatabaseServices()
  }
})