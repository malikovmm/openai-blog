import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { ArticleBlock } from './entities/article-block.entity';
import { CreateArticleAiDto } from './dto/create-article-ai.dto';
import { CreateArticleDto } from './dto/create-article.dto';

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

  public async createWithBlocksAi(
    articleBlocks: Partial<ArticleBlock>[],
    createArticleAiDto: CreateArticleAiDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const articleBlocksPromises = articleBlocks.map((block) => {
        return queryRunner.manager.save(ArticleBlock, block);
      });
      const savedBlocks = await Promise.all<ArticleBlock>(
        articleBlocksPromises,
      );
      const savedArticle = await queryRunner.manager.save(Article, {
        blocks: savedBlocks,
        title: createArticleAiDto.title,
        meta: {
          model: createArticleAiDto.model,
          max_tokens: createArticleAiDto.max_tokens,
          temperature: createArticleAiDto.temperature,
        },
      });
      await queryRunner.commitTransaction();
      return savedArticle;
    } catch (e) {
      console.error('Failed to save article', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  public async createWithBlocks(
    createArticleDto: CreateArticleDto,
    userId: number,
  ): Promise<Article> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const articleBlocksPromises = createArticleDto.blocks.map((block, ix) => {
        return queryRunner.manager.save(ArticleBlock, { ...block, order: ix });
      });
      const savedBlocks = await Promise.all<ArticleBlock>(
        articleBlocksPromises,
      );
      const savedArticle = await queryRunner.manager.save(Article, {
        blocks: savedBlocks,
        title: createArticleDto.title,
        author: { id: userId },
        meta: {
          created_by_ai: false,
        },
      });
      await queryRunner.commitTransaction();
      return savedArticle;
    } catch (e) {
      console.error('Failed to save article', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
