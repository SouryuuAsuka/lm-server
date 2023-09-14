import { Module, Global } from '@nestjs/common';
import { MinioModule } from '@src/framework/aws/minio/minio.module';

@Global()
@Module({
  imports: [MinioModule],
  exports: [MinioModule],
})
export class AwsModule {}
