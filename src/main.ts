import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { middleware as expressCtx } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { WinstonModule } from 'nest-winston';

import { ApiConfigModule } from '@common/config/api-config.module';
import { ApiConfigService } from '@common/config/api-config.service';
import { SharedModule } from '@common/shared/shared.module';
import { TranslationModule } from '@common/translation/translation.module';
import { TranslationService } from '@common/translation/translation.service';
import { HttpExceptionFilter } from '@filters/bad-request.filter';
import { QueryFailedFilter } from '@filters/query-failed.filter';
import { TranslationInterceptor } from '@interceptors/translation-interceptor.service';
import { loggerConfig } from '@src/logger';
import { setupSwagger } from '@src/setup-swagger';

import { AppModule } from './app.module';

// import {
//     initializeTransactionalContext,
//     patchTypeORMRepositoryWithBaseRepository,
// } from 'typeorm-transactional-cls-hooked';

export async function bootstrap(): Promise<NestExpressApplication> {
  // Typeorm Transactions
  // initializeTransactionalContext();
  // patchTypeORMRepositoryWithBaseRepository();

  // Creates an express http rest api
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: true,
      logger: WinstonModule.createLogger(loggerConfig('class-pins')),
    }
  );

  // Allows injecting entities for validation decorators
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Execution Context For NestJS
  const reflector = app.get(Reflector);

  // Configuration Service
  const configService = app.select(ApiConfigModule).get(ApiConfigService);

  // Security
  app.enable('trust proxy'); // only if you're behind a reverse proxy
  app.use(helmet());

  // Rate Limit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );

  // Api
  app.setGlobalPrefix('/api');
  app.use(compression());
  app.use(cookieParser());
  app.enableVersioning();

  // Logging And Metrics
  app.use(morgan('combined'));

  // Filters
  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector)
  );

  // Interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TranslationInterceptor(
      app.select(TranslationModule).get(TranslationService)
    )
  );

  // Pipelines
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    })
  );

  // Swagger Documentation
  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  // Async Hooks With Hooks for Express
  app.use(expressCtx);

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  // Starts server
  const port = configService.appConfig.port;

  const logger = new Logger('Base');

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  await app.listen(port, async () => {
    logger.log(`server running on ${await app.getUrl()}`);
  });

  return app;
}

void bootstrap();
