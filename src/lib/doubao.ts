import OpenAI from 'openai';

export interface DoubaoConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}

export class DoubaoClient {
  private client: OpenAI;
  private model: string;

  constructor(config: DoubaoConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://ark.cn-beijing.volces.com/api/v3',
      dangerouslyAllowBrowser: true // Allowing for client-side demo; in production use backend proxy
    });
    this.model = config.model || 'doubao-seed-1-8-251228'; // Default model
  }

  async generateResponse(messages: any[]) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
      });
      return response;
    } catch (error) {
      console.error('Doubao API Error:', error);
      throw error;
    }
  }

  // Helper to list models (if supported by the endpoint)
  async listModels() {
    // Note: Not all compatible endpoints support list models
    try {
      return await this.client.models.list();
    } catch (error) {
      console.warn('List models failed:', error);
      return { data: [] };
    }
  }
}
