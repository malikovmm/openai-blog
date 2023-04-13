import { IsNumber, IsString } from 'class-validator';

export class ArticleBlockDto {
  @IsString()
  picture: string;
  @IsString()
  content: string;
  @IsString()
  title: string;
  @IsNumber()
  pictureLocation: number;
}
