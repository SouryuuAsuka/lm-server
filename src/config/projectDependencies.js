const PostgresqlDatabaseServices = require('@database/postgresql/PostgresqlDatabaseService');
const MinioAwsService = require('@aws/minio/MinioAwsService');
const BcryptCryptoService = require('@crypto/bcrypt/BcryptCryptoService');
const JwtEncrypterService = require('@crypto/jwt/JwtEncrypterService');
const NodemailMailService = require('@mail/nodemail/NodemailMailService');

module.exports = (() => {
  return {
    DatabaseService: new PostgresqlDatabaseServices(),
    AwsService: new MinioAwsService(),
    CryproService: new BcryptCryptoService(),
    JwtService: new JwtEncrypterService(),
    MailService: new NodemailMailService(),
  }
})();