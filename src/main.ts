import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}


bootstrap();
