import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Configuration,
  CreateCompletionResponse,
  Model,
  OpenAIApi,
} from 'openai';
import { CreateCompletionRequest } from 'openai/api';

@Injectable()
export class OpenaiService implements OnModuleInit {
  private openaiApi: OpenAIApi;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      const configuration = new Configuration({
        apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      });
      const openai = new OpenAIApi(configuration);
      const response = await openai.retrieveModel('text-davinci-003');
      if (response.status === 200) {
        this.openaiApi = openai;
      }
    } catch (error) {
      console.error('Failed to initialize OpenaiService', error);
      throw error;
    }
  }

  public async createCompletion(
    request: CreateCompletionRequest,
  ): Promise<string> {
    try {
      const { data } = await this.openaiApi.createCompletion(request);
      return this.extractCompletionContent(data);
    } catch (e) {
      console.log(e);
    }
  }

  public async listModels(): Promise<Partial<Model>[]> {
    const { data } = await this.openaiApi.listModels();
    return data.data
      .map((it: Model) => ({ id: it.id, created: it.created }))
      .sort((a, b) => b.created - a.created);
  }

  private extractCompletionContent(data: CreateCompletionResponse) {
    return data.choices[0].text;
  }
}
