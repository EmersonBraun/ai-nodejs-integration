import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MinLength, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class BatchSentimentRequestDto {
  @ApiProperty({
    description: 'List of texts for analysis',
    example: [
      'I love Node.js and AI integration!',
      'This is terrible and disappointing',
      'Life is not worth living',
    ],
    minItems: 1,
    maxItems: 10,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  texts: string[];
}



