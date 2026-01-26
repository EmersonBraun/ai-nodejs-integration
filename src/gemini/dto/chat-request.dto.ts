import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'User message',
    example: 'Explain Node.js in one sentence.',
  })
  @IsString()
  message: string;
}


