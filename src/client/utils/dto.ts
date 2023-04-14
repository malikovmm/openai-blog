import { Article } from '../../server/article/entities/article.entity';
import { EditArticleDto } from '../../server/article/dto/edit-article.dto';
import { Settings } from '../../server/settings/entities/setting.entity';
import { CreateCompletionRequest } from 'openai';
import { removeKeys } from '../../server/util/objects';

export const convertArticleToEditDto = (article: Article): EditArticleDto => {
  return {
    title: article.title,
    blocks: article.blocks,
  };
};

export const convertSettingsToCreateCompletionRequest = (
  settings: Settings,
): CreateCompletionRequest => {
  return removeKeys<CreateCompletionRequest>(settings, ['id', 'translateTo']);
};
