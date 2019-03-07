import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/factories/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: validationExceptionFactory,
  }));
  await app.listen(3000);
}
bootstrap();
