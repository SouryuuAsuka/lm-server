import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserConfirmation(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        from: '"Сервер" <noreply@lampymarket.com>',
        to: email,
        subject: 'Подтвердите вашу почту на lampymarket.com',
        text: 'Ссылка на подтверждение: ' + link,
        html: 'Ссылка на подтверждение: <a href=' + link + '>' + link + '</a>',
      });
      //TODO: добавить проверку результата отправки
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
