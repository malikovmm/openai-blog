import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(createCategoryDto);
  }

  findAll(
    take: number,
    page: number,
    sortBy?: string,
    order?: string,
    nameFilter?: string,
  ) {
    const skip = (page - 1) * take;
    return this.categoryRepository.getPaginatedCategories(
      take,
      skip,
      sortBy,
      order,
      nameFilter,
    );
  }

  findOne(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }

  public async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.save({
      id,
      name: updateCategoryDto.name,
      description: updateCategoryDto.description,
    });
  }

  public async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
