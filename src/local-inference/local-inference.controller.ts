import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocalInferenceService } from './local-inference.service';
import { InferenceRequestDto } from './dto/inference-request.dto';
import { InferenceQueryDto } from './dto/inference-query.dto';
import { InferenceResponseDto } from './dto/inference-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';
import { StatusResponseDto } from './dto/status-response.dto';

@ApiTags('Local Inference')
@Controller('local-inference')
export class LocalInferenceController {
  constructor(private readonly localInferenceService: LocalInferenceService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Local inference with GGUF models' })
  @ApiResponse({
    status: 200,
    description: 'Executes inference using local models via node-llama-cpp. Requires configured GGUF model.',
    type: InferenceResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable - model not configured or node-llama-cpp not available',
    type: ErrorResponseDto,
  })
  async infer(
    @Body() dto: InferenceRequestDto,
    @Query() query: InferenceQueryDto,
  ): Promise<InferenceResponseDto> {
    return this.localInferenceService.infer(dto, query);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check local inference status' })
  @ApiResponse({
    status: 200,
    description: 'Checks if model is configured and available',
    type: StatusResponseDto,
  })
  async getStatus(): Promise<StatusResponseDto> {
    return this.localInferenceService.getStatus();
  }
}



