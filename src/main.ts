import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global prefix for API routes
  app.setGlobalPrefix('api');

  const port = configService.get<number>('port') || 3001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
