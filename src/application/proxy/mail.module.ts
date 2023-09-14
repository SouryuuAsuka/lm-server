import { Module, Global } from '@nestjs/common';
import { NodemailMailModule } from '@framework/mail/nodemail/nodemail.module';

@Global()
@Module({
  imports: [NodemailMailModule],
  exports: [NodemailMailModule],
})
export class MailModule {}
