import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/factories/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // use morgan
  app.use(morgan('dev'));
  // register validation pipe with custom error formatting factory
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: validationExceptionFactory,
  }));
  // swagger options
  const swaggerOptions = new DocumentBuilder()
    .setTitle('V2X Network Core API')
    .setDescription('REST API documentation for V2X Network Core Engine')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-docs', app, swaggerDocument);
  await app.listen(3000);
}
bootstrap();
