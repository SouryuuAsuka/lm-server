import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@framework/database/postgresql/postgresql.module';

@Module({
  imports: [PostgresqlDatabaseModule],
  exports: [PostgresqlDatabaseModule],
})
export class DatabaseModule {}