import { IsString, ValidateNested } from 'class-validator';
import { SetSettingDto } from '../../settings/dto/set-setting.dto';
import { CreateArticleBlockAiDto } from './create-article-block-ai.dto';

export class CreateArticleAiDto extends SetSettingDto {
  @IsString()
  title: string;

  @ValidateNested({ each: true })
  blocksData: CreateArticleBlockAiDto[];
}
