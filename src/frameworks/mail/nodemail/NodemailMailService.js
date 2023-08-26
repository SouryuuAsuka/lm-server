const NodemailUserTrasporter = require('@mail/nodemail/NodemailUserTrasporter')

const nodemailer = require('nodemailer')

module.exports = class NodemailMailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.zoho.eu",
      port: 465,
      secure: true,
      auth: {
          user: 'noreply@lampymarket.com',
          pass: 'jg3j&W%YV5i#yLF%CZfq'
      },
  })
    this.userTrasporter = new NodemailUserTrasporter(this.transporter);
  }
};