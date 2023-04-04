import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { ArticleBlock } from './entities/article-block.entity';

@Injectable()
export class ArticleBlockRepository extends Repository<ArticleBlock> {
  constructor(private readonly dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }
}
