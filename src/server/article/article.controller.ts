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
import GetAuthorizedUser from '../decorators/get-authorizated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { SessionAuthGuard } from '../guards/session-auth.guard';
import { EditArticleDto } from './dto/edit-article.dto';
import ParseIntSafePipe from '../pipes/ParseIntSafePipe';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
    @GetAuthorizedUser() user: User,
  ) {
    return this.articleService.create(createArticleDto, user.id);
  }

  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('ai')
  public async createAi(
    @Body() createArticleDto: CreateArticleDto,
    @GetAuthorizedUser() user: User,
  ) {
    return await this.articleService.createByAi(createArticleDto, user.id);
  }

  @Get()
  public async findAll(
    @Query('take', new ParseIntSafePipe(10)) take,
    @Query('page', new ParseIntSafePipe(1)) page,
    @Query('cat') categoryIds: number[] = [],
    @Query('sortBy') sortBy = 'id',
    @Query('order') order = 'ASC',
  ) {
    return await this.articleService.findAll(
      take,
      page,
      categoryIds,
      sortBy,
      order,
    );
  }

  @UseGuards(SessionAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @UseGuards(SessionAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() editArticleDto: EditArticleDto,
    @GetAuthorizedUser() userId: number,
  ) {
    return this.articleService.update(+id, editArticleDto, userId);
  }

  @UseGuards(SessionAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
