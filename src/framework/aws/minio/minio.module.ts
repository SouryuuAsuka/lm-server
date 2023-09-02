import { Module } from '@nestjs/common';
import { MinioService } from './minio.service'

/*const minioFactory = async () => {
  return new NestMinioModule.register(
    endPoint: 'lm-minio',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
  );
};*/

@Module({
  providers: [ MinioService ],
  exports: [ MinioService ],
})
export class MinioModule { }