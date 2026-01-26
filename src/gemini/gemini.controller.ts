import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { GeminiService } from './gemini.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ChatQueryDto } from './dto/chat-query.dto';

@ApiTags('Gemini')
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Get('models')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List available Gemini models' })
  @ApiResponse({
    status: 200,
    description: 'List of available models that support generateContent',
    type: [String],
  })
  async listModels(): Promise<{ models: string[] }> {
    const models = await this.geminiService.listModels();
    return { models };
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Simple chat with Gemini' })
  @ApiResponse({
    status: 200,
    description: 'Complete response from the model',
    type: ChatResponseDto,
  })
  async chat(
    @Body() dto: ChatRequestDto,
    @Query() query: ChatQueryDto,
  ): Promise<ChatResponseDto> {
    return this.geminiService.chat(dto.message, query.model, query.temperature);
  }

  @Post('stream')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chat with streaming responses' })
  @ApiResponse({
    status: 200,
    description: 'Real-time response via Server-Sent Events',
  })
  async stream(
    @Body() dto: ChatRequestDto,
    @Query() query: ChatQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      for await (const chunk of this.geminiService.stream(
        dto.message,
        query.model,
        query.temperature,
      )) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      res.status(500).json({
        error: 'Error processing stream',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}


