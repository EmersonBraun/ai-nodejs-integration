import { ApiProperty } from '@nestjs/swagger';
import { SentimentResultDto } from './sentiment-result.dto';
import { TranslatedSentimentDto } from './translated-sentiment.dto';

export class SentimentResponseDto {
  @ApiProperty({
    description: 'Original text',
    example: 'I love Node.js and AI integration!',
  })
  text: string;

  @ApiProperty({
    description: 'Sentiment analysis result',
    type: SentimentResultDto,
  })
  sentiment: SentimentResultDto;

  @ApiProperty({
    description: 'Translation of result to Portuguese',
    type: TranslatedSentimentDto,
  })
  translated: TranslatedSentimentDto;
}



