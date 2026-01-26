import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatbotRequestDto } from './dto/chatbot-request.dto';
import { ChatbotResponseDto } from './dto/chatbot-response.dto';
import { MessageDto, MessageRole } from './dto/message.dto';

@Injectable()
export class ChatbotService {
  constructor(private configService: ConfigService) {}

  async chat(dto: ChatbotRequestDto): Promise<ChatbotResponseDto> {
    try {
      const apiKey = this.configService.get<string>('gemini.apiKey');
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const temperature = dto.temperature ?? 0.7;

      const llm = new ChatGoogleGenerativeAI({
        apiKey,
        temperature,
        model: 'gemini-2.5-flash',
      });

      const prompt = PromptTemplate.fromTemplate(
        'You are a helpful assistant specialized in Node.js and AI. ' +
          'Answer clearly and objectively.\n\n' +
          'Conversation history:\n{history}\n\n' +
          'Current question: {input}\n\n' +
          'Answer:',
      );

      const history = dto.history || [];
      const historyText =
        history.length > 0
          ? history.map((msg) => `${msg.role}: ${msg.content}`).join('\n')
          : 'No previous conversation.';

      const chain = RunnableSequence.from([prompt, llm]);

      const response = await chain.invoke({
        input: dto.input,
        history: historyText,
      });

      const assistantResponse = response.content as string;

      const updatedHistory: MessageDto[] = [
        ...history,
        { role: MessageRole.User, content: dto.input },
        { role: MessageRole.Assistant, content: assistantResponse },
      ];

      return {
        response: assistantResponse,
        history: updatedHistory,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error processing request: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }
}


