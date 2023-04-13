import { IsString, ValidateNested } from 'class-validator';
import { ArticleBlockDto } from './create-article-block.dto';

export class CreateArticleDto {
  @IsString()
  title: string;
  @ValidateNested({ each: true })
  blocks: ArticleBlockDto[];
}
