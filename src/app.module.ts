import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiConfigModule } from '@common/config/api-config.module';
import { ApiConfigService } from '@common/config/api-config.service';
import { TranslationModule } from '@common/translation/translation.module';
import { HealthCheckerModule } from '@modules/health-checker/health-checker.module';
import { UserModule } from '@modules/user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TranslationModule,
    ApiConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    UserModule,
    HealthCheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
