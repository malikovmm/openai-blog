import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { OpenaiService } from '../openai/openai.service';
import { ArticleRepository } from './article.repository';
import { CategoryRepository } from '../category/category.repository';
import { ImageService } from '../images/image.service';
import { ArticleBlock } from './entities/article-block.entity';
import { EditArticleDto } from './dto/edit-article.dto';
import { ArticleBlockDto } from './dto/create-article-block.dto';
import { Settings } from '../settings/entities/setting.entity';
import { convertSettingsToCreateCompletionRequest } from '../../client/utils/dto';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly articleRepository: ArticleRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly googleSearchService: ImageService,
    private readonly settingsService: SettingsService,
  ) {}

  async createByAi(createArticleDto: CreateArticleDto, userId: number) {
    const userSettings: Settings = await this.settingsService.findUserSettings(
      userId,
    );
    const blockImages = await this.receiveBlockImages(createArticleDto.blocks);
    const blockContents = await this.receiveBlockContent(
      createArticleDto,
      userSettings,
    );
    const articleBlocks = this.buildArticleBlocks(
      createArticleDto.blocks,
      blockImages,
      blockContents,
    );
    return this.articleRepository.createWithBlocksAi(
      articleBlocks,
      createArticleDto,
      userSettings,
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

  private receiveBlockImages(blocks: ArticleBlockDto[]) {
    const images = blocks.map((it) =>
      this.googleSearchService.searchImage(it.picture),
    );
    return Promise.all(images);
  }

  private async receiveBlockContent(
    dto: CreateArticleDto,
    userSettings: Settings,
  ): Promise<string[]> {
    const completionSettingsBase =
      convertSettingsToCreateCompletionRequest(userSettings);
    const blocksContent = dto.blocks.map((it) => {
      return this.openaiService.createCompletion({
        ...completionSettingsBase,
        prompt: it.content,
      });
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
    blocksData: CreateArticleDto['blocks'],
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
          pictureLocation: blocksData[i].pictureLocation ?? 0,
          order: i,
        });
      }
    }
    return res;
  }
}
