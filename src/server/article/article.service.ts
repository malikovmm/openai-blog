import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { OpenaiService } from '../openai/openai.service';
import { CreateArticleAiDto } from './dto/create-article-ai.dto';
import { ArticleRepository } from './article.repository';
import { User } from '../auth/entities/user.entity';
import { CategoryRepository } from '../category/category.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly articleRepository: ArticleRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createByAi(createArticleAiDto: CreateArticleAiDto, user: User) {
    const completionRes = await this.openaiService.createCompletion(
      createArticleAiDto,
    );
    const [genText] = completionRes.choices;
    const created = this.articleRepository.create({
      meta: createArticleAiDto,
      categories: [],
      content: genText as string,
      title: '',
      author: user,
    });
    return await this.articleRepository.save(created);
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
}
