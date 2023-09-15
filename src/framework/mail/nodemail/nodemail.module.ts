import { Module } from '@nestjs/common';
import { IMailService } from '@src/application/ports/IMailService';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '@src/framework/mail/nodemail/nodemail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  providers: [{ provide: IMailService, useClass: MailService }],
  exports: [IMailService],
})
export class NodemailMailModule { }
