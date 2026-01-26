import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SentimentRequestDto {
  @ApiProperty({
    description: 'Text for analysis',
    example: 'I love Node.js and AI integration!',
  })
  @IsString()
  text: string;
}



