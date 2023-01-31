import path from 'path';

import { Global, Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

import { ApiConfigModule } from '@common/config/api-config.module';
import { ApiConfigService } from '@common/config/api-config.service';
import { TranslationService } from '@common/translation/translation.service';

@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
      imports: [ApiConfigModule],
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, './messages'),
          watch: configService.isDevelopment,
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
