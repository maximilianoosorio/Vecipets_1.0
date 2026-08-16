import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌐 Configuración dinámica de CORS (Local + Vercel en Producción)
  const allowedOrigins = [
    'http://localhost:3000',
    'https://vecipets.vercel.app',
    // Permite despliegues preview o staging de Vercel
    /\.vercel\.app$/,
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Prefijo global de rutas
  app.setGlobalPrefix('api/v1');

  // Validaciones globales de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🚀 Escuchar en el puerto dinámico de la nube y en '0.0.0.0'
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend de VeciPets corriendo en el puerto: ${port} (Prefijo: /api/v1)`);
}
bootstrap();