import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';
import { SentimentRequestDto } from './dto/sentiment-request.dto';
import { SentimentResponseDto } from './dto/sentiment-response.dto';
import { BatchSentimentRequestDto } from './dto/batch-sentiment-request.dto';
import { BatchSentimentResponseDto } from './dto/batch-sentiment-response.dto';
import { SentimentResultDto, SentimentLabel } from './dto/sentiment-result.dto';
import { TranslatedSentimentDto } from './dto/translated-sentiment.dto';
import { BatchSentimentItemDto } from './dto/batch-sentiment-item.dto';
import { BatchSentimentSummaryDto } from './dto/batch-sentiment-summary.dto';

@Injectable()
export class SentimentService {
  private readonly logger = new Logger(SentimentService.name);
  private sentimentPipeline: any = null;

  private async getSentimentPipeline(): Promise<any> {
    if (!this.sentimentPipeline) {
      this.logger.log('Loading sentiment analysis model...');
      this.sentimentPipeline = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      );
      this.logger.log('Model loaded successfully');
    }
    return this.sentimentPipeline;
  }

  async analyze(dto: SentimentRequestDto): Promise<SentimentResponseDto> {
    try {
      const classifier = await this.getSentimentPipeline();
      const result = await classifier(dto.text);
      const sentiment = Array.isArray(result) ? result[0] : result;

      const translated: TranslatedSentimentDto = {
        label: sentiment.label === 'POSITIVE' ? 'POSITIVO' : 'NEGATIVO',
        description:
          sentiment.label === 'POSITIVE'
            ? 'The text expresses positive sentiment'
            : 'The text expresses negative sentiment',
      };

      const sentimentResult: SentimentResultDto = {
        label: sentiment.label as SentimentLabel,
        score: Math.round(sentiment.score * 100) / 100,
      };

      return {
        text: dto.text,
        sentiment: sentimentResult,
        translated,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error analyzing sentiment: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async analyzeBatch(dto: BatchSentimentRequestDto): Promise<BatchSentimentResponseDto> {
    try {
      const classifier = await this.getSentimentPipeline();

      const results: BatchSentimentItemDto[] = await Promise.all(
        dto.texts.map(async (text) => {
          const result = await classifier(text);
          const sentiment = Array.isArray(result) ? result[0] : result;
          return {
            text,
            sentiment: {
              label: sentiment.label as SentimentLabel,
              score: Math.round(sentiment.score * 100) / 100,
            },
          };
        }),
      );

      const summary: BatchSentimentSummaryDto = {
        total: results.length,
        positive: results.filter((r) => r.sentiment.label === SentimentLabel.Positive).length,
        negative: results.filter((r) => r.sentiment.label === SentimentLabel.Negative).length,
      };

      return {
        results,
        summary,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error analyzing sentiments in batch: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }
}



