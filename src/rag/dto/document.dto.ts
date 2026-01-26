import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentMetadataDto } from './document-metadata.dto';

export class DocumentDto {
  @ApiProperty({
    description: 'Document content',
    example: 'Node.js is a JavaScript platform built on Chrome\'s V8 engine.',
  })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({
    description: 'Document metadata',
    type: DocumentMetadataDto,
  })
  @ValidateNested()
  @Type(() => DocumentMetadataDto)
  metadata: DocumentMetadataDto;
}

