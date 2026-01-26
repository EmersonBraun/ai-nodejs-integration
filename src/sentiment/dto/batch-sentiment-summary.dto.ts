import { ApiProperty } from '@nestjs/swagger';

export class BatchSentimentSummaryDto {
  @ApiProperty({
    description: 'Total number of texts analyzed',
    example: 3,
  })
  total: number;

  @ApiProperty({
    description: 'Number of positive sentiments',
    example: 1,
  })
  positive: number;

  @ApiProperty({
    description: 'Number of negative sentiments',
    example: 2,
  })
  negative: number;
}



