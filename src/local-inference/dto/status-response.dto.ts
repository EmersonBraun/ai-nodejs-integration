import { ApiProperty } from '@nestjs/swagger';

export class StatusResponseDto {
  @ApiProperty({
    description: 'Whether model is configured',
    example: true,
  })
  configured: boolean;

  @ApiProperty({
    description: 'Model path if configured',
    example: './models/llama-7b-q4_0.gguf',
    nullable: true,
  })
  modelPath: string | null;

  @ApiProperty({
    description: 'Whether model file is available',
    example: true,
  })
  available: boolean;

  @ApiProperty({
    description: 'Whether node-llama-cpp is installed',
    example: true,
  })
  nodeLlamaCppInstalled: boolean;
}



