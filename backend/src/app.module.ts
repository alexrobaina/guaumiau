import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationsModule } from './notifications/notifications.module';
import { S3Module } from './s3/s3.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PetsModule } from './pets/pets.module';
import { UploadsModule } from './uploads/uploads.module';
import { ProvidersModule } from './providers/providers.module';
import { PlacesModule } from './places/places.module';
import { MorganMiddleware } from './common/middleware/morgan.middleware';
import { winstonConfig } from './common/logger/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'short',
          ttl: 1000, // 1 second
          limit: parseInt(config.get('THROTTLE_SHORT_LIMIT') || '50'), // Increased from 5 to 50
        },
        {
          name: 'medium',
          ttl: 10000, // 10 seconds
          limit: parseInt(config.get('THROTTLE_MEDIUM_LIMIT') || '200'), // Increased from 20 to 200
        },
        {
          name: 'long',
          ttl: 60000, // 60 seconds
          limit: parseInt(config.get('THROTTLE_LONG_LIMIT') || '1000'), // Increased from 300 to 1000
        },
      ],
    }),
    PrismaModule,
    NotificationsModule,
    S3Module,
    AuthModule,
    EmailModule,
    PetsModule,
    UploadsModule,
    ProvidersModule,
    PlacesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
