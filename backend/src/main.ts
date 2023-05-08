import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './common/factories/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // allow all CORS
  app.enableCors();
  // register validation pipe with custom error formatting factory
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle(
      `[${
        process.env.DEPLOYMENT_ENV
          ? process.env.DEPLOYMENT_ENV.toUpperCase()
          : 'DEV'
      }] API Spec`,
    )
    .setDescription(
      `API specification. ${
        process.env.APP_DEPLOYED_DATE
          ? 'Deployment: ' + process.env.APP_DEPLOYED_DATE
          : ''
      }`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  const appUrl = await app.getUrl();
  console.log(
    `Application is running on: ${appUrl} & API Docs are accssible at: ${appUrl}/api-docs`,
  );
}
bootstrap();
