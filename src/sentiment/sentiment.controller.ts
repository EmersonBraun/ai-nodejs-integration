import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SentimentService } from './sentiment.service';
import { SentimentRequestDto } from './dto/sentiment-request.dto';
import { SentimentResponseDto } from './dto/sentiment-response.dto';
import { BatchSentimentRequestDto } from './dto/batch-sentiment-request.dto';
import { BatchSentimentResponseDto } from './dto/batch-sentiment-response.dto';

@ApiTags('Sentiment Analysis')
@Controller('sentiment')
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sentiment analysis with Transformers.js' })
  @ApiResponse({
    status: 200,
    description: 'Analyzes sentiment of a text using local models (free, no API)',
    type: SentimentResponseDto,
  })
  async analyze(@Body() dto: SentimentRequestDto): Promise<SentimentResponseDto> {
    return this.sentimentService.analyze(dto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Batch sentiment analysis' })
  @ApiResponse({
    status: 200,
    description: 'Analyzes multiple texts at once',
    type: BatchSentimentResponseDto,
  })
  async analyzeBatch(@Body() dto: BatchSentimentRequestDto): Promise<BatchSentimentResponseDto> {
    return this.sentimentService.analyzeBatch(dto);
  }
}



