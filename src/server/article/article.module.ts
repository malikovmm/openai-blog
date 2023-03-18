import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { OpenaiModule } from '../openai/openai.module';
import { ArticleRepository } from './article.repository';
import { CategoryRepository } from '../category/category.repository';
import { UserRepository } from '../auth/user.repository';

@Module({
  imports: [OpenaiModule, TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleRepository,
    CategoryRepository,
    UserRepository,
  ],
})
export class ArticleModule {}
