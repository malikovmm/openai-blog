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
import { ImagesModule } from '../images/images.module';
import { ImageService } from '../images/image.service';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';

@Module({
  imports: [
    OpenaiModule,
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([ArticleBlock]),
    ImagesModule,
    SettingsModule,
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleRepository,
    CategoryRepository,
    UserRepository,
    ImageService,
    SettingsService,
  ],
})
export class ArticleModule {}
