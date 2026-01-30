"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const filters_1 = require("./common/filters");
const interceptors_1 = require("./common/interceptors");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port') || 3002;
    const frontendUrl = configService.get('frontend.url');
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ["http://localhost:3000"],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new filters_1.HttpExceptionFilter(), new filters_1.PrismaExceptionFilter());
    app.useGlobalInterceptors(new interceptors_1.LoggingInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('BEM Planning FC API')
        .setDescription('API Backend pour la gestion de planning académique')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT',
    }, 'JWT-auth')
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    await app.listen(port);
    logger.log(`Application démarrée sur le port ${port}`);
    logger.log(`Documentation Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map