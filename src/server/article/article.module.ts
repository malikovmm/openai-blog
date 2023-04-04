import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { OpenaiModule } from '../openai/openai.module';
import { ArticleRepository } from './article.repository';
import { CategoryRepository } from '../category/category.repository';
import { UserRepository } from '../auth/user.repository';
import { ArticleBlock } from './entities/article-block.entity';
import { GoogleSearchModule } from '../google-search/google-search.module';
import { GoogleSearchService } from '../google-search/google-search.service';

@Module({
  imports: [
    OpenaiModule,
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([ArticleBlock]),
    GoogleSearchModule,
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleRepository,
    CategoryRepository,
    UserRepository,
    GoogleSearchService,
  ],
})
export class ArticleModule {}
