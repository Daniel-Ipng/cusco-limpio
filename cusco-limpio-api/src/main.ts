import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS para que el frontend pueda conectarse
  app.enableCors({
    origin: [
      'http://localhost:5173',
      /\.vercel\.app$/,        // permite cualquier subdominio de Vercel
      /\.railway\.app$/,       // permite cualquier subdominio de Railway
    ],
    credentials: true,
  })

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Cusco Limpio API corriendo en http://localhost:${port}`);
}

bootstrap();