import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RagService } from './rag.service';
import { IngestRequestDto } from './dto/ingest-request.dto';
import { IngestResponseDto } from './dto/ingest-response.dto';
import { QueryRequestDto } from './dto/query-request.dto';
import { QueryResponseDto } from './dto/query-response.dto';

@ApiTags('RAG')
@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ingest documents into vector store' })
  @ApiResponse({
    status: 200,
    description: 'Adds documents to vector store for RAG usage',
    type: IngestResponseDto,
  })
  async ingest(@Body() dto: IngestRequestDto): Promise<IngestResponseDto> {
    return this.ragService.ingest(dto);
  }

  @Post('query')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Query with RAG' })
  @ApiResponse({
    status: 200,
    description: 'Searches for relevant documents and generates answer using LLM',
    type: QueryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found. Execute /ingest first to create the collection.',
  })
  async query(@Body() dto: QueryRequestDto): Promise<QueryResponseDto> {
    return this.ragService.query(dto);
  }
}

