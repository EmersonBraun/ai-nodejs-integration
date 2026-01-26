import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentDto } from './document.dto';

export class IngestRequestDto {
  @ApiProperty({
    description: 'List of documents to ingest',
    type: [DocumentDto],
    example: [
      {
        content: 'Node.js is a JavaScript platform built on Chrome\'s V8 engine.',
        metadata: {
          category: 'technology',
          source: 'documentation',
        },
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents: DocumentDto[];

  @ApiProperty({
    description: 'Collection name in Chroma',
    example: 'default',
    default: 'default',
    required: false,
  })
  @IsOptional()
  @IsString()
  collectionName?: string;
}

