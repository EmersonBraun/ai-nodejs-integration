import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, Min, Max, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageDto } from './message.dto';

export class ChatbotRequestDto {
  @ApiProperty({
    description: 'User message',
    example: 'How do I create a Fastify server?',
  })
  @IsString()
  input: string;

  @ApiProperty({
    description: 'Conversation history (optional)',
    type: [MessageDto],
    default: [],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  history?: MessageDto[];

  @ApiProperty({
    description: 'Temperature for creativity (0-2)',
    example: 0.7,
    default: 0.7,
    minimum: 0,
    maximum: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;
}



