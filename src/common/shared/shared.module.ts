import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [ValidatorService, AwsS3Service, GeneratorService],
  exports: [ValidatorService, AwsS3Service, GeneratorService],
})
export class SharedModule {}
