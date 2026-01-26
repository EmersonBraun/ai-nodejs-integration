import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error type',
    example: 'Model not configured',
  })
  error: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Configure LLAMA_MODEL_PATH in .env or provide modelPath in body',
  })
  message: string;

  @ApiProperty({
    description: 'Instructions to resolve the error',
    example: 'Download a GGUF model from https://huggingface.co/models?search=gguf and configure the path',
  })
  instructions: string;
}



