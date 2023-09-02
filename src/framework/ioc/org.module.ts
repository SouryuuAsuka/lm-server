import { Module } from '@nestjs/common';

import { IOrgsRepository } from '@application/ports/IOrgsRepository';
import { OrgsUseCases } from '@application/use-cases/org/org.use-cases';
import { OrgsRepository } from '@framework/database/postgresql/repository/OrgsRepository';
import { OrgsController } from '@presentation/controllers/org/org.controller';

@Module({
  imports: [],
  controllers: [OrgsController],
  providers: [
    OrgsUseCases,
    { provide: IOrgsRepository, useClass: OrgsRepository },
  ],
})
export class OrgsModule {}