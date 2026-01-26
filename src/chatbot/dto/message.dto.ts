import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
}

export class MessageDto {
  @ApiProperty({
    description: 'Message role',
    enum: MessageRole,
    example: MessageRole.User,
  })
  @IsEnum(MessageRole)
  role: MessageRole;

  @ApiProperty({
    description: 'Message content',
    example: 'How do I create a Fastify server?',
  })
  @IsString()
  content: string;
}



