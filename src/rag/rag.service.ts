import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { GeminiEmbeddings } from './utils/gemini-embeddings';
import { IngestRequestDto } from './dto/ingest-request.dto';
import { IngestResponseDto } from './dto/ingest-response.dto';
import { QueryRequestDto } from './dto/query-request.dto';
import { QueryResponseDto } from './dto/query-response.dto';
import { DocumentResultDto } from './dto/document-result.dto';

@Injectable()
export class RagService {
  constructor(private configService: ConfigService) {}

  async ingest(dto: IngestRequestDto): Promise<IngestResponseDto> {
    try {
      const apiKey = this.configService.get<string>('gemini.apiKey');
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const embeddings = new GeminiEmbeddings(apiKey);
      const collectionName = dto.collectionName || 'default';

      const texts = dto.documents.map((doc) => doc.content);
      const metadatas = dto.documents.map((doc) => doc.metadata);

      let vectorStore;
      try {
        vectorStore = await Chroma.fromExistingCollection(embeddings, {
          collectionName,
        });
        await vectorStore.addDocuments(
          texts.map((text, i) => ({
            pageContent: text,
            metadata: metadatas[i] || {},
          })),
        );
      } catch {
        vectorStore = await Chroma.fromTexts(texts, metadatas, embeddings, {
          collectionName,
        });
      }

      return {
        message: 'Documents ingested successfully',
        count: dto.documents.length,
      };
    } catch (error) {
      if (error instanceof Error) {
        // Verificar se é erro de quota
        if (error.message.includes('Quota exceeded') || error.message.includes('quota')) {
          throw new BadRequestException(
            `Error ingesting documents: ${error.message}. The free tier has limited embedding requests per day. Please wait or upgrade your plan.`,
          );
        }
        throw new InternalServerErrorException(`Error ingesting documents: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async query(dto: QueryRequestDto): Promise<QueryResponseDto> {
    try {
      const apiKey = this.configService.get<string>('gemini.apiKey');
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const embeddings = new GeminiEmbeddings(apiKey);
      const collectionName = dto.collectionName || 'default';
      const k = dto.k || 5;

      let vectorStore;
      try {
        vectorStore = await Chroma.fromExistingCollection(embeddings, {
          collectionName,
        });
      } catch {
        throw new NotFoundException('Collection not found. Execute /ingest first.');
      }

      const results = await vectorStore.similaritySearchWithScore(
        dto.query,
        k,
        dto.filter,
      );

      const documents: DocumentResultDto[] = results.map(([doc, score]) => ({
        content: doc.pageContent,
        metadata: doc.metadata as Record<string, unknown>,
        score,
      }));

      const context = documents.map((d) => d.content).join('\n\n');

      // Usar o modelo gemini-2.5-flash-lite para gerar resposta baseada no contexto
      const llm = new ChatGoogleGenerativeAI({
        apiKey,
        temperature: 0.7,
        model: 'gemini-2.5-flash-lite',
      });

      const prompt = PromptTemplate.fromTemplate(
        'You are a helpful assistant that answers questions based on the provided context from documents. ' +
          'Use only the information from the context to answer the question. ' +
          'If the context does not contain enough information to answer the question, say so clearly.\n\n' +
          'Context from documents:\n{context}\n\n' +
          'Question: {query}\n\n' +
          'Answer:',
      );

      const chain = RunnableSequence.from([prompt, llm]);

      const response = await chain.invoke({
        context,
        query: dto.query,
      });

      const answer = response.content as string;

      return {
        query: dto.query,
        documents,
        answer,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error processing query: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }
}


