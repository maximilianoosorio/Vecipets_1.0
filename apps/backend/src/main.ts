import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔴 IMPORTANTE: Habilitar CORS para permitir peticiones desde el Frontend (puerto 3000)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Configuración de prefijo global y validaciones
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend de VeciPets corriendo en: http://localhost:${port}/api/v1`);
}
bootstrap();