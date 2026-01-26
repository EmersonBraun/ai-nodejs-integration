import { ApiProperty } from '@nestjs/swagger';
import { SentimentResultDto } from './sentiment-result.dto';

export class BatchSentimentItemDto {
  @ApiProperty({
    description: 'Text analyzed',
    example: 'I love Node.js and AI integration!',
  })
  text: string;

  @ApiProperty({
    description: 'Sentiment analysis result',
    type: SentimentResultDto,
  })
  sentiment: SentimentResultDto;
}



