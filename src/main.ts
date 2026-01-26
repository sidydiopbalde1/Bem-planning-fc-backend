import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter, PrismaExceptionFilter } from './common/filters';
import { LoggingInterceptor } from './common/interceptors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3002;
  const frontendUrl = configService.get<string>('frontend.url');

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('BEM Planning FC API')
    .setDescription('API Backend pour la gestion de planning académique')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentification')
    .addTag('users', 'Gestion utilisateurs')
    .addTag('intervenants', 'Gestion intervenants')
    .addTag('programmes', 'Gestion programmes')
    .addTag('modules', 'Gestion modules')
    .addTag('seances', 'Gestion séances')
    .addTag('planning', 'Planification automatique')
    .addTag('salles', 'Gestion salles')
    .addTag('rotations-weekend', 'Rotations weekend')
    .addTag('notifications', 'Notifications')
    .addTag('evaluations', 'Évaluations enseignements')
    .addTag('admin', 'Administration')
    .addTag('coordinateur', 'Dashboard coordinateur')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  logger.log(`Application démarrée sur le port ${port}`);
  logger.log(`Documentation Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
