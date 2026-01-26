import { GoogleGenerativeAI } from '@google/generative-ai';
import { Embeddings } from '@langchain/core/embeddings';

export class GeminiEmbeddings extends Embeddings {
  private genAI: GoogleGenerativeAI;
  private modelName: string;
  private apiKey: string;

  constructor(apiKey: string, modelName: string = 'models/embedding-001') {
    super({});
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  private isQuotaError(error: Error): boolean {
    return (
      error.message.includes('429') ||
      error.message.includes('quota') ||
      error.message.includes('Quota exceeded') ||
      error.message.includes('rate limit')
    );
  }

  private extractRetryAfter(error: Error): string | null {
    const retryMatch = error.message.match(/retry in ([\d.]+)s/i);
    if (retryMatch) {
      const seconds = Math.ceil(parseFloat(retryMatch[1]));
      return `${seconds} seconds`;
    }
    return null;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });
    const embeddings: number[][] = [];

    for (const text of texts) {
      try {
        const result = await model.embedContent(text);
        const embedding = (result as any).embedding?.values || (result as any).embedding || [];
        embeddings.push(Array.isArray(embedding) ? embedding : Array.from(embedding));
      } catch (error) {
        if (error instanceof Error && this.isQuotaError(error)) {
          const retryAfter = this.extractRetryAfter(error);
          const retryMessage = retryAfter ? ` Please retry after ${retryAfter}.` : '';
          throw new Error(
            `Quota exceeded for embedding model "${this.modelName}". The free tier has limited requests per day.${retryMessage} For more information, visit: https://ai.google.dev/gemini-api/docs/rate-limits`,
          );
        }
        throw new Error(`Error generating embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });
    try {
      const result = await model.embedContent(text);
      const embedding = (result as any).embedding?.values || (result as any).embedding || [];
      return Array.isArray(embedding) ? embedding : Array.from(embedding);
    } catch (error) {
      if (error instanceof Error && this.isQuotaError(error)) {
        const retryAfter = this.extractRetryAfter(error);
        const retryMessage = retryAfter ? ` Please retry after ${retryAfter}.` : '';
        throw new Error(
          `Quota exceeded for embedding model "${this.modelName}". The free tier has limited requests per day.${retryMessage} For more information, visit: https://ai.google.dev/gemini-api/docs/rate-limits`,
        );
      }
      throw new Error(`Error generating embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

