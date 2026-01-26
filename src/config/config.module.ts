import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { validate } from './config.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      validate,
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
