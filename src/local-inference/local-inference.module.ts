import { Module } from '@nestjs/common';
import { LocalInferenceController } from './local-inference.controller';
import { LocalInferenceService } from './local-inference.service';

@Module({
  controllers: [LocalInferenceController],
  providers: [LocalInferenceService],
  exports: [LocalInferenceService],
})
export class LocalInferenceModule {}



