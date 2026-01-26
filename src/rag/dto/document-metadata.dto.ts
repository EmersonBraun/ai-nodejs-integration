import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class DocumentMetadataDto {
  @ApiProperty({
    description: 'Document category',
    example: 'technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Document source',
    example: 'documentation',
    required: false,
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({
    description: 'Document title',
    example: 'Node.js Introduction',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  [key: string]: unknown;
}



