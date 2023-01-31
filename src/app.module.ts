import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import "./boilerplate.polyfill"
import { ApiConfigModule } from "@common/config/api-config.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigService } from "@common/config/api-config.service";
import { I18nModule } from "nestjs-i18n";
import * as path from "path";
import { HealthCheckerModule } from "@modules/health-checker/health-checker.module";

@Module({
  imports: [
    ApiConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/common/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
