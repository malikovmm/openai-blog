import { AiSettingsDto } from './ai-settings.dto';
import { IsOptional, IsString } from 'class-validator';

export class SetSettingDto extends AiSettingsDto {
  @IsString()
  @IsOptional()
  translateTo?: string;
}
