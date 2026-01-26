import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class InferenceQueryDto {
  @ApiProperty({
    description: 'Context size in tokens. Defines how many tokens the model can consider when generating a response. Larger values allow more context but consume more memory. Range: 512-8192. Default: 2048',
    example: 2048,
    default: 2048,
    minimum: 512,
    maximum: 8192,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(512)
  @Max(8192)
  contextSize?: number;

  @ApiProperty({
    description: 'Temperature controls the randomness of generation. Lower values (0.0-0.5) generate more deterministic and focused responses. Higher values (1.0-2.0) generate more creative and varied responses. Range: 0.0-2.0. Default: 0.7',
    example: 0.7,
    default: 0.7,
    minimum: 0,
    maximum: 2,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;
}

