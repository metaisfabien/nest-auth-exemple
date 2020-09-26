import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

// Déclaration des variables d'environement
declare const process: {
  env: {
    NODE_ENV: string; // Node environement
  };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  // Pour ajouter l'injection de dependance dans les validateurs
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle('Auth exemple')
      .setDescription('Auth API description')
      .setVersion('1.0')
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(configService.get('APP_PORT') || 3000);
}
bootstrap();
