import {
  Injectable,
  ServiceUnavailableException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs/promises';
import { InferenceRequestDto } from './dto/inference-request.dto';
import { InferenceQueryDto } from './dto/inference-query.dto';
import { InferenceResponseDto } from './dto/inference-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';
import { StatusResponseDto } from './dto/status-response.dto';

@Injectable()
export class LocalInferenceService {
  private readonly logger = new Logger(LocalInferenceService.name);

  constructor(private configService: ConfigService) {}

  async infer(
    dto: InferenceRequestDto,
    query: InferenceQueryDto,
  ): Promise<InferenceResponseDto> {
    const finalModelPath = dto.modelPath || this.configService.get<string>('llama.modelPath');

    if (!finalModelPath) {
      const errorResponse: ErrorResponseDto = {
        error: 'Model not configured',
        message: 'Configure LLAMA_MODEL_PATH in .env or provide modelPath in body',
        instructions:
          'Download a GGUF model from https://huggingface.co/models?search=gguf and configure the path',
      };
      throw new ServiceUnavailableException(errorResponse);
    }

    try {
      await access(finalModelPath);
    } catch {
      const errorResponse: ErrorResponseDto = {
        error: 'Model not found',
        message: `File not found: ${finalModelPath}`,
        instructions: 'Download a GGUF model and place it at the specified path',
      };
      throw new ServiceUnavailableException(errorResponse);
    }

    let getLlama: any, LlamaChatSession: any;
    try {
      const importDynamic = new Function('specifier', 'return import(specifier)');
      const llamaCpp = await importDynamic('node-llama-cpp');
      getLlama = llamaCpp.getLlama;
      LlamaChatSession = llamaCpp.LlamaChatSession;
    } catch (error: unknown) {
      const errorResponse: ErrorResponseDto = {
        error: 'node-llama-cpp not available',
        message: error instanceof Error ? error.message : 'Unknown error',
        instructions: 'Install node-llama-cpp: npm install node-llama-cpp. Note: node-llama-cpp requires ESM and may need Node.js with --experimental-loader flag.',
      };
      throw new ServiceUnavailableException(errorResponse);
    }

    this.logger.log(`Initializing Llama and loading model: ${finalModelPath}`);

    let model: any;
    try {
      const llama = await getLlama();
      model = await llama.loadModel({
        modelPath: finalModelPath,
      });
    } catch (error) {
      this.logger.error(`Error loading model: ${error}`);
      const errorResponse: ErrorResponseDto = {
        error: 'Error loading model',
        message: error instanceof Error ? error.message : 'Unknown error',
        instructions:
          'Verify that the GGUF model is correct and that node-llama-cpp is installed correctly',
      };
      throw new InternalServerErrorException(errorResponse);
    }

    this.logger.log('Creating context...');
    const contextSize = query.contextSize || 2048;
    const context = await model.createContext({
      contextSize,
    });

    this.logger.log('Creating context sequence...');
    const sequence = context.getSequence();

    const session = new LlamaChatSession({
      contextSequence: sequence,
    });

    this.logger.log('Generating response...');
    const temperature = query.temperature ?? 0.7;
    const response = await session.prompt(dto.prompt, {
      temperature,
    });

    return {
      response: response as string,
      modelPath: finalModelPath,
    };
  } catch (error: unknown) {
    if (
      error instanceof ServiceUnavailableException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Error executing local inference');
  }

  async getStatus(): Promise<StatusResponseDto> {
    const modelPath = this.configService.get<string>('llama.modelPath');
    let available = false;
    let nodeLlamaCppInstalled = false;

    if (modelPath) {
      try {
        await access(modelPath);
        available = true;
      } catch {
        available = false;
      }
    }

    try {
      const importDynamic = new Function('specifier', 'return import(specifier)');
      await importDynamic('node-llama-cpp');
      nodeLlamaCppInstalled = true;
    } catch {
      nodeLlamaCppInstalled = false;
    }

    return {
      configured: !!modelPath,
      modelPath: modelPath || null,
      available,
      nodeLlamaCppInstalled,
    };
  }
}

