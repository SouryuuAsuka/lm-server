import { Module, Global } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@src/framework/database/postgresql/postgresql.module';

@Global()
@Module({
  imports: [PostgresqlDatabaseModule],
  exports: [PostgresqlDatabaseModule],
})
export class DatabaseModule {}
