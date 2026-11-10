import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar CORS para recibir peticiones desde el frontend de Angular
  app.enableCors();

  // 2. Establecer el prefijo global para las rutas (ej: /api/shifts)
  app.setGlobalPrefix('api');

  // 3. Configurar validaciones globales automáticas con DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 4. Iniciar el servidor UNA SOLA VEZ al final de la configuración
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend corriendo exitosamente en: http://localhost:${port}/api`);
}
bootstrap();
