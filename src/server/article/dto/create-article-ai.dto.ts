import { IsString, IsOptional } from 'class-validator';
import { SetSettingDto } from '../../settings/dto/set-setting.dto';

export class CreateArticleAiDto extends SetSettingDto {
  @IsString()
  @IsOptional()
  prompt?: string;
}
