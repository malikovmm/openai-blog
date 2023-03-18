import { Module } from '@nestjs/common';

import { ViewModule } from './view/view.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ViewModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const asd = {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: parseInt(configService.get('DATABASE_PORT'), 10),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_DBNAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
        return asd as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    ArticleModule,
    CategoryModule,
    AuthModule,
    OpenaiModule,
  ],
})
export class ServerModule {}
