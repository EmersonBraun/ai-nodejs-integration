import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { ChatbotRequestDto } from './dto/chatbot-request.dto';
import { ChatbotResponseDto } from './dto/chatbot-response.dto';

@ApiTags('LangChain')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chatbot with LangChain.js' })
  @ApiResponse({
    status: 200,
    description: 'Simple chatbot using LangChain.js with conversation history support',
    type: ChatbotResponseDto,
  })
  async chat(@Body() dto: ChatbotRequestDto): Promise<ChatbotResponseDto> {
    return this.chatbotService.chat(dto);
  }
}



