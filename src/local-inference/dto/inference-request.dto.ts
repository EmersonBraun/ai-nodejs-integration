import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class InferenceRequestDto {
  @ApiProperty({
    description: 'Prompt for the model',
    example: 'What is the capital of France?',
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    description: 'Path to GGUF model (optional, uses LLAMA_MODEL_PATH from .env if not provided)',
    example: './models/llama-7b-q4_0.gguf',
    required: false,
  })
  @IsOptional()
  @IsString()
  modelPath?: string;
}



