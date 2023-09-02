import { Injectable } from '@nestjs/common'
import * as Minio from 'minio'
import * as path from 'path'
import * as sharp from 'sharp'

@Injectable()
export class MinioService {
  private minio: Minio.Client
  private bucketName: string

  constructor() {
    this.minio = new Minio.Client({
      endPoint: 'lm-minio',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY
    });
  }

  async savePicture(file, newFilename, repository) {
    try {
      let image = sharp(file.path); // path to the stored image
      await image.resize({ width: 720, height: 720 }).toFormat("jpeg", { mozjpeg: true }).toFile(
        path.resolve(file.destination, 'resized', file.filename)
      )
      const metaData = { 'Content-Type': 'image/jpeg' }
      await this.minio.fPutObject(
        repository,
        newFilename + ".jpeg",
        path.resolve(file.destination, 'resized', file.filename),
        metaData);
      return true;
    } catch (err) {
      console.log(err);
      throw "Ошибка при сохранении изображения";
    }
  }
}