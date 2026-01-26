import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AI and ML Integration API')
    .setDescription('REST API demonstrating AI and Machine Learning integration in Node.js')
    .setVersion('1.0.0')
    .addTag('Gemini', 'Endpoints for Google Gemini integration')
    .addTag('LangChain', 'Endpoints using LangChain.js')
    .addTag('RAG', 'Retrieval-Augmented Generation')
    .addTag('Local Inference', 'Local inference with GGUF models')
    .addTag('Sentiment Analysis', 'Sentiment analysis with Transformers.js')
    .addServer(`http://localhost:${configService.get('port')}`, 'Local server')
    .setContact('Emerson Braun', 'https://linkedin.com/in/emerson-braun', '')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('port') || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/docs`);
}

bootstrap();

