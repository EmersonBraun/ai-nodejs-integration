import { ApiProperty } from '@nestjs/swagger';

export class InferenceResponseDto {
  @ApiProperty({
    description: 'Model response',
    example: 'The capital of France is Paris.',
  })
  response: string;

  @ApiProperty({
    description: 'Path of the model used',
    example: './models/llama-7b-q4_0.gguf',
  })
  modelPath: string;
}



