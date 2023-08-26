const PostgresqlOrgRepository = require('@database/postgresql/PostgresqlOrgRepository');
const PostgresqlPaymentRepository = require('@database/postgresql/PostgresqlPaymentRepository');
const PostgresqlCartRepository = require('@database/postgresql/PostgresqlCartRepository');
const PostgresqlCourierRepository = require('@database/postgresql/PostgresqlCourierRepository');
const PostgresqlProductRepository = require('@database/postgresql/PostgresqlProductRepository');
const PostgresqlUserRepository = require('@database/postgresql/PostgresqlUserRepository');
const Pool = require('pg').Pool;

module.exports = class PostgresqlDatabaseService {
  constructor() {
    this.pool = new Pool({
      user: process.env.POSTGRESQL_USER,
      database: process.env.POSTGRESQL_DATABASE,
      password: process.env.POSTGRESQL_PASSWORD,
      port: 5432,
      host: '172.17.0.1',
    });
    this.orgRepository = new PostgresqlOrgRepository(this.pool);
    this.paymentRepository = new PostgresqlPaymentRepository(this.pool);
    this.cartRepository = new PostgresqlCartRepository(this.pool);
    this.courierRepository = new PostgresqlCourierRepository(this.pool);
    this.productRepository = new PostgresqlProductRepository(this.pool);
    this.userRepository = new PostgresqlUserRepository(this.pool);
  }
};