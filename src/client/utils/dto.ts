import { Article } from '../../server/article/entities/article.entity';
import { EditArticleDto } from '../../server/article/dto/edit-article.dto';

export const convertArticleToEditDto = (article: Article): EditArticleDto => {
  return {
    title: article.title,
    blocks: article.blocks,
  };
};
