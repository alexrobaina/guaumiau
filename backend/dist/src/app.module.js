"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const nest_winston_1 = require("nest-winston");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const notifications_module_1 = require("./notifications/notifications.module");
const s3_module_1 = require("./s3/s3.module");
const auth_module_1 = require("./auth/auth.module");
const email_module_1 = require("./email/email.module");
const pets_module_1 = require("./pets/pets.module");
const uploads_module_1 = require("./uploads/uploads.module");
const providers_module_1 = require("./providers/providers.module");
const places_module_1 = require("./places/places.module");
const morgan_middleware_1 = require("./common/middleware/morgan.middleware");
const winston_config_1 = require("./common/logger/winston.config");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(morgan_middleware_1.MorganMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            nest_winston_1.WinstonModule.forRoot(winston_config_1.winstonConfig),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        name: 'default',
                        ttl: 60000,
                        limit: parseInt(config.get('THROTTLE_LIMIT') || '10000'),
                    },
                ],
            }),
            prisma_module_1.PrismaModule,
            notifications_module_1.NotificationsModule,
            s3_module_1.S3Module,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
            pets_module_1.PetsModule,
            uploads_module_1.UploadsModule,
            providers_module_1.ProvidersModule,
            places_module_1.PlacesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map