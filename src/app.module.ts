import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { GeminiModule } from './gemini/gemini.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { RagModule } from './rag/rag.module';
import { LocalInferenceModule } from './local-inference/local-inference.module';
import { SentimentModule } from './sentiment/sentiment.module';

@Module({
  imports: [
    ConfigModule,
    GeminiModule,
    ChatbotModule,
    RagModule,
    LocalInferenceModule,
    SentimentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

