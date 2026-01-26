import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './configuration';

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, {
    GEMINI_API_KEY: config.GEMINI_API_KEY,
    PINECONE_API_KEY: config.PINECONE_API_KEY,
    REDIS_URL: config.REDIS_URL,
    PORT: config.PORT ? Number(config.PORT) : undefined,
    NODE_ENV: config.NODE_ENV,
    LLAMA_MODEL_PATH: config.LLAMA_MODEL_PATH,
  }, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map(error => Object.values(error.constraints || {}).join(', ')).join('; ');
    throw new Error(`Configuration validation failed: ${errorMessages}`);
  }
  return validatedConfig;
}

