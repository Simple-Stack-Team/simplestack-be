import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from 'src/app.module';
import { DEFAULT_ORIGIN, DEFAULT_PORT, swaggerConfig } from 'src/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: DEFAULT_ORIGIN });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || DEFAULT_PORT;

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app
    .listen(port)
    .then(() => console.log(`App started on http://localhost:${port}`));
}

bootstrap();
