import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { ArticleBlock } from './entities/article-block.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';
import { Settings } from '../settings/entities/setting.entity';

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
    createArticleDto: CreateArticleDto,
    userSettings: Settings,
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
        title: createArticleDto.title,
        meta: {
          model: userSettings.model,
          max_tokens: userSettings.max_tokens,
          temperature: userSettings.temperature,
        },
        publish_at: createArticleDto.publishAt,
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
        publish_at: createArticleDto.publishAt,
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

  public async updateWithBlocks(
    id: number,
    editArticleDto: EditArticleDto,
    userId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .getRepository(ArticleBlock)
        .delete({ article: { id } });
      const updatedBlocks = editArticleDto.blocks.map((block, ix) => {
        return queryRunner.manager.save(ArticleBlock, { ...block, order: ix });
      });
      const savedBlocks = await Promise.all<ArticleBlock>(updatedBlocks);
      await queryRunner.manager.getRepository(Article).save({
        id,
        blocks: savedBlocks,
        title: editArticleDto.title,
        author: { id: userId },
      });
      await queryRunner.commitTransaction();
    } catch (e) {
      console.error('Failed to update article', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
