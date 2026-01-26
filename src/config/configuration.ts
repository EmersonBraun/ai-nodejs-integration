import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsString()
  GEMINI_API_KEY: string;

  @IsOptional()
  @IsString()
  PINECONE_API_KEY?: string;

  @IsOptional()
  @IsString()
  REDIS_URL?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT?: number;

  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV?: Environment;

  @IsOptional()
  @IsString()
  LLAMA_MODEL_PATH?: string;
}

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  llama: {
    modelPath: process.env.LLAMA_MODEL_PATH,
  },
});



