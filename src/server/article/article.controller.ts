import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleAiDto } from './dto/create-article-ai.dto';
import GetAuthorizedUser from '../decorators/get-authorizated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { SessionAuthGuard } from '../guards/session-auth.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('ai')
  public async createAi(
    @Body() createArticleAiDto: CreateArticleAiDto,
    @GetAuthorizedUser() user: User,
  ) {
    return await this.articleService.createByAi(createArticleAiDto, user);
  }

  @Get()
  public async findAll(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('cat') categoryIds?: number[],
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    return await this.articleService.findAll(
      take,
      skip,
      categoryIds,
      sortBy,
      order,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @UseGuards(SessionAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @UseGuards(SessionAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
