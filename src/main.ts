import { NestFactory } from '@nestjs/core';
import fastifyCookie from '@fastify/cookie';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HttpExceptionFilter } from '@src/framework/nestjs/filters/http-exeptions.filter';
import { VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { MyLogger } from './framework/nestjs/logger/logger.service';
import * as fmp from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  await app.register(fastifyCookie);
  const logger = app.get<MyLogger>(MyLogger);
  app.register(fmp);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .setTitle('Notes API')
    .setDescription('The notes API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,OPTIONS,POST,DELETE',
  });

  await app.listen(3000, '0.0.0.0', () => {
    console.log(`⛱  Lampy Server listening on port 3000`);
    console.log('Press Ctrl+C to quit.');
  });
}
bootstrap();
