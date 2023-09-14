import { Module } from '@nestjs/common';

import { OrgsUseCases } from '@src/application/use-cases/org/org.use-cases';
import { OrgsController } from '@src/presentation/controllers/';

@Module({
  imports: [],
  controllers: [OrgsController],
  providers: [OrgsUseCases],
})
export class OrgsModule {}
