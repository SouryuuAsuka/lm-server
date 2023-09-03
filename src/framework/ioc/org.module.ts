import { Module } from '@nestjs/common';

import { OrgsUseCases } from '@application/use-cases/org/org.use-cases';
import { OrgsController } from '@presentation/controllers/org/org.controller';

@Module({
  imports: [],
  controllers: [OrgsController],
  providers: [
    OrgsUseCases,
  ],
})
export class OrgsModule {}