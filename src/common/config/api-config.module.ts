import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiConfigService } from '@common/config/api-config.service';
import { configuration } from '@common/config/configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
      load: [configuration],
      cache: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      expandVariables: true,
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
