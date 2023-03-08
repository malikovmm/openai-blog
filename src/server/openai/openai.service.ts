import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, CreateCompletionResponse, OpenAIApi } from 'openai';
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

  async createCompletion(
    createCompletionRequest: CreateCompletionRequest,
  ): Promise<CreateCompletionResponse> {
    const { data } = await this.openaiApi.createCompletion(
      createCompletionRequest,
    );
    return data;
  }
}
