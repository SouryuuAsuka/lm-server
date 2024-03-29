import { Module } from '@nestjs/common';

import { PaymentsUseCases } from '@src/application/use-cases/payment.use-case';
import { PaymentsController } from '@src/presentation/controllers/';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [PaymentsUseCases],
})
export class PaymentsModule {}
