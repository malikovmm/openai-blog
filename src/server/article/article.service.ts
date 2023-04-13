import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { OpenaiService } from '../openai/openai.service';
import { CreateArticleAiDto } from './dto/create-article-ai.dto';
import { ArticleRepository } from './article.repository';
import { CategoryRepository } from '../category/category.repository';
import { ImageService } from '../images/image.service';
import { CreateArticleBlockAiDto } from './dto/create-article-block-ai.dto';
import { removeKeys } from '../util/objects';
import { ArticleBlock } from './entities/article-block.entity';
import { EditArticleDto } from './dto/edit-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly articleRepository: ArticleRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly googleSearchService: ImageService,
  ) {}

  async createByAi(createArticleAiDto: CreateArticleAiDto) {
    const blockImages = await this.receiveBlockImages(
      createArticleAiDto.blocksData,
    );
    const blockContents = await this.receiveBlockContent(createArticleAiDto);
    const articleBlocks = this.buildArticleBlocks(
      createArticleAiDto.blocksData,
      blockImages,
      blockContents,
    );
    return this.articleRepository.createWithBlocksAi(
      articleBlocks,
      createArticleAiDto,
    );
  }

  public async create(createArticleDto: CreateArticleDto, userId: number) {
    return this.articleRepository.createWithBlocks(createArticleDto, userId);
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

  public async findOne(id: number) {
    return this.articleRepository.findOne({
      where: { id },
      relations: {
        blocks: true,
        categories: true,
      },
    });
  }

  public async update(
    id: number,
    editArticleDto: EditArticleDto,
    userId: number,
  ) {
    await this.articleRepository.updateWithBlocks(id, editArticleDto, userId);
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
