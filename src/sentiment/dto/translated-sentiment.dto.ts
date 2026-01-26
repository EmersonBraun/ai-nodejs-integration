import { ApiProperty } from '@nestjs/swagger';

export class TranslatedSentimentDto {
  @ApiProperty({
    description: 'Translated label',
    example: 'POSITIVO',
  })
  label: string;

  @ApiProperty({
    description: 'Description in Portuguese',
    example: 'The text expresses positive sentiment',
  })
  description: string;
}



