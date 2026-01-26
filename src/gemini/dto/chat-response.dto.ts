import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDto {
  @ApiProperty({
    description: 'Model response',
    example: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine.',
  })
  response: string;

  @ApiProperty({
    description: 'Model used',
    example: 'gemini-2.5-flash',
  })
  model: string;
}


