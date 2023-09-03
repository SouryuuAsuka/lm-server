import { Module } from '@nestjs/common';

import { PaymentsUseCases } from '@application/use-cases/payment/payment.use-cases';
import { PaymentsController } from '@presentation/controllers/payment/payment.controller';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [
    PaymentsUseCases,
  ],
})
export class PaymentsModule {}