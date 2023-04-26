import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';

try {
  dotenv.config({ path: '.env' });
} catch (e) {
  console.warn('dotenv not found, docker env vars will be used');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = Number(process.env.PORT) || 3000;

  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true, parameterLimit: 1000 }));
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 500,
      message: 'Muitas tentativas, tente novamente mais tarde.',
    })
  );
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}
bootstrap();
