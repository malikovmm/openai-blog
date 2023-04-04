import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PictureData {
  @IsString()
  prompt: string;
  @IsOptional()
  location: number;
}

export class CreateArticleBlockAiDto {
  @IsString()
  title: string;

  @IsString()
  prompt: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PictureData)
  pictureData: PictureData;
}
