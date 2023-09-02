import { Module } from '@nestjs/common';

import { IPaymentsRepository } from '@application/ports/IPaymentsRepository';
import { PaymentsUseCases } from '@application/use-cases/payment/payment.use-cases';
import { PaymentsRepository } from '@framework/database/postgresql/repository/PaymentsRepository';
import { PaymentsController } from '@presentation/controllers/payment/payment.controller';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [
    PaymentsUseCases,
    { provide: IPaymentsRepository, useClass: PaymentsRepository },
  ],
})
export class PaymentsModule {}