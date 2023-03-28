import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Configuration,
  CreateCompletionResponse,
  Model,
  OpenAIApi,
} from 'openai';
import { CreateCompletionRequest } from 'openai/api';
import { CreateArticleAiDto } from '../article/dto/create-article-ai.dto';
import { removeAllExceptNames } from '../util/objects';

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
    createCompletionRequest: CreateArticleAiDto,
  ): Promise<CreateCompletionResponse> {
    const requestBody = this.prepareRequestObject(createCompletionRequest);
    const { data } = await this.openaiApi.createCompletion(requestBody);
    return data;
  }

  public async listModels(): Promise<Partial<Model>[]> {
    const { data } = await this.openaiApi.listModels();
    return data.data
      .map((it: Model) => ({ id: it.id, created: it.created }))
      .sort((a, b) => b.created - a.created);
  }

  private prepareRequestObject(createCompletionRequest: CreateArticleAiDto) {
    const requestBody = removeAllExceptNames<CreateCompletionRequest>(
      createCompletionRequest,
      ['translateTo'],
    );
    if (!requestBody?.stop[0]?.length) {
      requestBody.stop = undefined;
    }
    return requestBody;
  }
}
