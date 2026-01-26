import { ApiProperty } from '@nestjs/swagger';

export enum SentimentLabel {
  Positive = 'POSITIVE',
  Negative = 'NEGATIVE',
}

export class SentimentResultDto {
  @ApiProperty({
    description: 'Sentiment label',
    enum: SentimentLabel,
    example: SentimentLabel.Positive,
  })
  label: SentimentLabel;

  @ApiProperty({
    description: 'Confidence score (0-1)',
    example: 0.95,
  })
  score: number;
}



