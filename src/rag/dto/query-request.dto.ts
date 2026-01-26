import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max, IsObject } from 'class-validator';

export class QueryRequestDto {
  @ApiProperty({
    description: 'Query or question',
    example: 'What is Node.js?',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Collection name in Chroma',
    example: 'default',
    default: 'default',
    required: false,
  })
  @IsOptional()
  @IsString()
  collectionName?: string;

  @ApiProperty({
    description: 'Number of relevant documents to return',
    example: 5,
    default: 5,
    minimum: 1,
    maximum: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  k?: number;

  @ApiProperty({
    description: 'Metadata filters (optional)',
    example: { category: 'technology' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  filter?: Record<string, unknown>;
}



