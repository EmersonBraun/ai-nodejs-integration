import { ApiProperty } from '@nestjs/swagger';
import { BatchSentimentItemDto } from './batch-sentiment-item.dto';
import { BatchSentimentSummaryDto } from './batch-sentiment-summary.dto';

export class BatchSentimentResponseDto {
  @ApiProperty({
    description: 'Analysis results for each text',
    type: [BatchSentimentItemDto],
  })
  results: BatchSentimentItemDto[];

  @ApiProperty({
    description: 'Summary of sentiment analysis',
    type: BatchSentimentSummaryDto,
  })
  summary: BatchSentimentSummaryDto;
}



