module.exports = class NodemailUserTrasporter {
  constructor(transporter) {
    this.transporter = transporter;
  }
  async sendLinkToConfirmMail(email, link) {
    try {
      await this.transporter.sendMail({
        from: '"Сервер" <noreply@lampymarket.com>',
        to: email,
        subject: 'Подтвердите вашу почту на lampymarket.com',
        text: 'Ссылка на подтверждение: ' + link,
        html:
          'Ссылка на подтверждение: <a href=' + link + '>' + link + '</a>',
      });
      //TODO: добавить проверку результата отправки
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}