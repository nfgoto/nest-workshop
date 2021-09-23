import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

const cookieSeesion = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        entities: [User, Report],
        // always set to false,, 
        // use migration files to modify DB structure on different envs
        synchronize: false
      }),

    }),
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
  ],
  controllers: [
    AppController],
  providers: [
    AppService,
    // set global validation pipe, instead of in the main
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    },
    ConfigService,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) { }

  // call when starting to listen to incoming traffic
  configure(consumer: MiddlewareConsumer) {
    // will run on every incoming request
    const cookieSessionMdlw = cookieSeesion({
      keys: [this.configService.get('COOKIE_KEY')]
    })
    consumer
      .apply(cookieSessionMdlw)
      .forRoutes('*');
  }
}
