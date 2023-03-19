import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(private readonly dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }

  public async getPaginatedArticles(
    take: number,
    skip: number,
    categoryIds?: number[],
    sortBy?: string,
    order?: string,
  ) {
    const [articles, total] = await this.findAndCount({
      where: {
        categories: {
          id: In(categoryIds),
        },
      },
      relations: {
        categories: true,
      },
      order: {
        [sortBy]: order,
      },
      take,
      skip,
    });
    return {
      articles,
      total,
    };
  }
}
