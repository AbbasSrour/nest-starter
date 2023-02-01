import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiConfigModule } from '@common/config/api-config.module';
import { ApiConfigService } from '@common/config/api-config.service';
import { SharedModule } from '@common/shared/shared.module';
import { TranslationModule } from '@common/translation/translation.module';
import { AuthModule } from '@modules/auth/auth.module';
import { HealthCheckerModule } from '@modules/health-checker/health-checker.module';
import { UserModule } from '@modules/user/user.module';
import { ExistsValidator } from '@validators/exists.validator';
import { UniqueValidator } from '@validators/unique.validator';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ApiConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    TranslationModule,
    SharedModule,
    UserModule,
    AuthModule,
    HealthCheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService, ExistsValidator, UniqueValidator],
})
export class AppModule {}
