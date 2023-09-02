import { Module } from '@nestjs/common';
import { MinioModule } from '@framework/aws/minio/minio.module'; 

@Module({
  imports: [MinioModule],
  exports: [MinioModule],
})
export class AwsModule {}