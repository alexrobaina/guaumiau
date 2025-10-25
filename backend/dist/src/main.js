"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const nest_winston_1 = require("nest-winston");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        } : false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter(), new prisma_exception_filter_1.PrismaExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:8081', 'http://localhost:19000', 'http://localhost:19001'];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
                callback(null, true);
            }
            else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Authorization'],
        maxAge: 3600,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Guaumiau API')
        .setDescription('API documentation for Guaumiau - Pet Care Services Platform')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management endpoints')
        .addTag('pets', 'Pet management endpoints')
        .addTag('services', 'Service provider endpoints')
        .addTag('bookings', 'Booking management endpoints')
        .addTag('notifications', 'Notification endpoints')
        .addTag('s3', 'File upload endpoints')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Local Development')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
        customSiteTitle: 'Guaumiau API Docs',
        customfavIcon: 'https://nestjs.com/img/logo-small.svg',
        customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { font-size: 2.5rem; }
    `,
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
    logger.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`🔒 CORS enabled for: ${allowedOrigins.join(', ')}`);
}
bootstrap().catch((error) => {
    console.error('❌ Error starting application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map