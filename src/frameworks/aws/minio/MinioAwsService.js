//const MinioAvatarepository = require('');
const MinioAvatarRepository = require('@aws/minio/MinioAvatarRepository')
const Minio = require('minio');

module.exports = class MinioAwsService {
  constructor() {
    this.minio = new Minio.Client({
      endPoint: 'lm-minio',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY
    });
    this.avatarRepository = new MinioAvatarRepository(this.minio);
  }
};