import { CreateCompletionRequest } from 'openai/api';
import { IsNumber, IsBoolean, IsString } from 'class-validator';

export class CreateArticleAiDto implements CreateCompletionRequest {
  @IsNumber()
  best_of: number;
  @IsBoolean()
  echo: boolean;
  @IsNumber()
  frequency_penalty: number;
  logit_bias: object;
  @IsNumber()
  logprobs: number;
  @IsNumber()
  max_tokens: number;
  @IsString()
  model: string;
  @IsNumber()
  n: number;
  @IsNumber()
  presence_penalty: number;
  @IsString()
  prompt: string;
  @IsString()
  stop: string;
  stream: boolean;
  @IsString()
  suffix: string;
  @IsNumber()
  temperature: number;
  @IsNumber()
  top_p: number;
  @IsString()
  user: string;
}
