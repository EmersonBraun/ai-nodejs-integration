import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum GeminiModel {
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_2_5_PRO = 'gemini-2.5-pro',
  GEMINI_2_0_FLASH = 'gemini-2.0-flash',
  GEMINI_2_0_FLASH_001 = 'gemini-2.0-flash-001',
  GEMINI_2_0_FLASH_LITE_001 = 'gemini-2.0-flash-lite-001',
  GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite',
  GEMINI_2_5_FLASH_LITE = 'gemini-2.5-flash-lite',
}

export class ChatQueryDto {
  @ApiProperty({
    description: 'Model to use. Call GET /api/gemini/models to see all available models for your API key. If not provided, the first available model will be used automatically.',
    enum: GeminiModel,
    enumName: 'GeminiModel',
    example: GeminiModel.GEMINI_2_5_FLASH,
    default: GeminiModel.GEMINI_2_5_FLASH,
    required: false,
  })
  @IsOptional()
  @IsEnum(GeminiModel)
  model?: GeminiModel;

  @ApiProperty({
    description: 'Temperature for creativity (0-2)',
    example: 0.7,
    default: 0.7,
    minimum: 0,
    maximum: 2,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;
}

