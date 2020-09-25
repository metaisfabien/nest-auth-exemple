import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pour ajouter l'injection de dependance dans les validateurs
  useContainer(app, { fallback: true });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
