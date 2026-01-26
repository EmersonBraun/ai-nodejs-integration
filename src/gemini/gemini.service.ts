import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatResponseDto } from './dto/chat-response.dto';
import { GeminiModel } from './dto/chat-query.dto';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('gemini.apiKey');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${this.apiKey}`,
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json() as {
        models?: Array<{
          name: string;
          supportedGenerationMethods?: string[];
        }>;
      };
      
      return (data.models || [])
        .filter((m) => 
          m.supportedGenerationMethods?.includes('generateContent') ||
          m.supportedGenerationMethods?.includes('generateContentStream')
        )
        .map((m) => m.name.replace('models/', ''));
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error listing models: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async chat(
    message: string,
    model?: GeminiModel | string,
    temperature?: number,
  ): Promise<ChatResponseDto> {
    try {
      let selectedModel = model ? String(model) : undefined;
      
      // Buscar modelos disponíveis
      const availableModels = await this.listModels();
      
      if (availableModels.length === 0) {
        throw new BadRequestException(
          'No models available. Please check your API key or call GET /api/gemini/models to see available models.',
        );
      }
      
      // Se não fornecido, usar o primeiro disponível
      if (!selectedModel) {
        selectedModel = availableModels[0];
      } else {
        // Validar se o modelo fornecido está disponível
        if (!availableModels.includes(selectedModel)) {
          throw new BadRequestException(
            `Model "${selectedModel}" is not available. Available models: ${availableModels.join(', ')}. Call GET /api/gemini/models to see all available models.`,
          );
        }
      }
      
      const selectedTemperature = temperature ?? 0.7;

      const geminiModel = this.genAI.getGenerativeModel({
        model: selectedModel,
        generationConfig: { temperature: selectedTemperature },
      });

      const result = await geminiModel.generateContent(message);
      const responseText = result.response.text();

      return {
        response: responseText,
        model: selectedModel,
      };
    } catch (error) {
      // Se já é uma BadRequestException, re-lançar
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        // Verificar se é um erro 404 do modelo
        if (error.message.includes('404 Not Found') || error.message.includes('is not found')) {
          const availableModels = await this.listModels().catch(() => []);
          throw new BadRequestException(
            `Model not found. Available models: ${availableModels.length > 0 ? availableModels.join(', ') : 'Call GET /api/gemini/models to see available models'}.`,
          );
        }
        throw new InternalServerErrorException(`Error processing request: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async *stream(
    message: string,
    model?: GeminiModel | string,
    temperature?: number,
  ): AsyncGenerator<string, void, unknown> {
    try {
      let selectedModel = model ? String(model) : undefined;
      
      // Buscar modelos disponíveis
      const availableModels = await this.listModels();
      
      if (availableModels.length === 0) {
        throw new BadRequestException(
          'No models available. Please check your API key or call GET /api/gemini/models to see available models.',
        );
      }
      
      // Se não fornecido, usar o primeiro disponível
      if (!selectedModel) {
        selectedModel = availableModels[0];
      } else {
        // Validar se o modelo fornecido está disponível
        if (!availableModels.includes(selectedModel)) {
          throw new BadRequestException(
            `Model "${selectedModel}" is not available. Available models: ${availableModels.join(', ')}. Call GET /api/gemini/models to see all available models.`,
          );
        }
      }
      
      const selectedTemperature = temperature ?? 0.7;

      const geminiModel = this.genAI.getGenerativeModel({
        model: selectedModel,
        generationConfig: { temperature: selectedTemperature },
      });

      const result = await geminiModel.generateContentStream(message);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error) {
      // Se já é uma BadRequestException, re-lançar
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        // Verificar se é um erro 404 do modelo
        if (error.message.includes('404 Not Found') || error.message.includes('is not found')) {
          const availableModels = await this.listModels().catch(() => []);
          throw new BadRequestException(
            `Model not found. Available models: ${availableModels.length > 0 ? availableModels.join(', ') : 'Call GET /api/gemini/models to see available models'}.`,
          );
        }
        throw new InternalServerErrorException(`Error processing stream: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }
}


