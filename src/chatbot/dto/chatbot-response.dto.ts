import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from './message.dto';

export class ChatbotResponseDto {
  @ApiProperty({
    description: 'Chatbot response',
    example: 'To create a Fastify server, you need to install Fastify and create an instance...',
  })
  response: string;

  @ApiProperty({
    description: 'Updated conversation history',
    type: [MessageDto],
  })
  history: MessageDto[];
}



