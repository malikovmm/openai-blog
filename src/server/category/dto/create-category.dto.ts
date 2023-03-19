import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
