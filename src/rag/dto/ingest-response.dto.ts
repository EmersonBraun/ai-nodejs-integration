import { ApiProperty } from '@nestjs/swagger';

export class IngestResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Documents ingested successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Number of documents ingested',
    example: 1,
  })
  count: number;
}



