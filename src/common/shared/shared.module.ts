import {HttpModule} from '@nestjs/axios';
import {Global, Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';

import {ApiConfigService} from '../config/api-config.service';
import {AwsS3Service} from './services/aws-s3.service';
import {GeneratorService} from './services/generator.service';
import {TranslationService} from './services/translation.service';
import {ValidatorService} from './services/validator.service';

const providers = [];

@Global()
@Module({
    imports: [HttpModule, CqrsModule],
    exports: [
        ApiConfigService,
        ValidatorService,
        AwsS3Service,
        GeneratorService,
        TranslationService,
        HttpModule,
        CqrsModule
    ],
})
export class SharedModule {}
