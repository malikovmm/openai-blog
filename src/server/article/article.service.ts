import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { OpenaiService } from '../openai/openai.service';
import { CreateArticleAiDto } from './dto/create-article-ai.dto';
import { ArticleRepository } from './article.repository';
import { User } from '../auth/entities/user.entity';
import { CategoryRepository } from '../category/category.repository';
import { GoogleSearchService } from '../google-search/google-search.service';
import { CreateArticleBlockAiDto } from './dto/create-article-block-ai.dto';
import { removeKeys } from '../util/objects';
import { ArticleBlock } from './entities/article-block.entity';

@Injectable()
export class ArticleService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly articleRepository: ArticleRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly googleSearchService: GoogleSearchService,
  ) {}

  async createByAi(createArticleAiDto: CreateArticleAiDto, user: User) {
    const blockImages = await this.receiveBlockImages(
      createArticleAiDto.blocksData,
    );
    const blockContents = await this.receiveBlockContent(createArticleAiDto);
    const articleBlocks = this.buildArticleBlocks(
      createArticleAiDto.blocksData,
      blockImages,
      blockContents,
    );
    return this.articleRepository.createWithBlocks(
      articleBlocks,
      createArticleAiDto,
      user.id,
    );
  }

  create(createArticleDto: CreateArticleDto) {
    return `create article`;
  }

  public async findAll(
    take: number,
    skip: number,
    categoryIds?: number[],
    sortBy?: string,
    order?: string,
  ) {
    return await this.articleRepository.getPaginatedArticles(
      take,
      skip,
      categoryIds,
      sortBy,
      order,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }

  private receiveBlockImages(blocksData: CreateArticleBlockAiDto[]) {
    const images = blocksData.map((it) =>
      this.googleSearchService.searchImage(it.pictureData.prompt),
    );
    return Promise.all(images);
  }

  private receiveBlockContent(dto: CreateArticleAiDto): Promise<string[]> {
    const blocksContent = dto.blocksData.map((it) => {
      return this.openaiService.createCompletion(
        removeKeys<CreateArticleAiDto>(
          {
            ...dto,
            prompt: it.prompt,
          },
          ['translateTo', 'blocksData', 'title'],
        ),
      );
    });
    return Promise.allSettled(blocksContent).then((it) =>
      it.map((aiResponse) => {
        if (aiResponse.status === 'fulfilled') {
          return aiResponse.value;
        }
        console.error('Failed to receive block content', it);
        return null;
      }),
    );
  }

  private buildArticleBlocks(
    blocksData: CreateArticleAiDto['blocksData'],
    blockImages: string[],
    blockContents: string[],
  ): Partial<ArticleBlock>[] {
    const res: Partial<ArticleBlock>[] = [];
    for (let i = 0; i < blocksData.length; i++) {
      if (blockContents) {
        res.push({
          title: blocksData[i].title,
          content: blockContents[i],
          picture: blockImages[i],
          pictureLocation: blocksData[i].pictureData.location ?? 0,
          order: i,
        });
      }
    }
    return res;
  }
}
