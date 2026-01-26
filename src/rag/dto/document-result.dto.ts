import { ApiProperty } from '@nestjs/swagger';

export class DocumentResultDto {
  @ApiProperty({
    description: 'Document content',
    example: 'Node.js is a JavaScript platform built on Chrome\'s V8 engine.',
  })
  content: string;

  @ApiProperty({
    description: 'Document metadata',
    example: { category: 'technology', source: 'documentation' },
  })
  metadata: Record<string, unknown>;

  @ApiProperty({
    description: 'Similarity score',
    example: 0.95,
  })
  score: number;
}



