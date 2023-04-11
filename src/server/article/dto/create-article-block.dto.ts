import { IsNumber, IsString } from 'class-validator';

export class CreateArticleBlock {
  @IsString()
  picture: string;
  @IsString()
  content: string;
  @IsString()
  title: string;
  @IsNumber()
  pictureLocation: number;
}
