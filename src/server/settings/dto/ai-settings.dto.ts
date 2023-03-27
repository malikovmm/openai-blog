import { CreateCompletionRequest } from 'openai/api';
import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator';

export class AiSettingsDto implements CreateCompletionRequest {
  @IsNumber()
  @IsOptional()
  max_tokens?: number;
  @IsString()
  model: string;

  @IsString()
  @IsOptional()
  prompt?: string;
  @IsArray()
  @IsOptional()
  stop?: string[];
  @IsString()
  @IsOptional()
  suffix?: string;
  @IsNumber()
  @IsOptional()
  temperature?: number;
}
