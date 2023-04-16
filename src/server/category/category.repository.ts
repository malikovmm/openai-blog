import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, Like, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  public async getPaginatedCategories(
    take: number,
    skip: number,
    sortBy?: string,
    order?: string,
    nameFilter?: string,
  ) {
    const options: FindManyOptions<Category> = {
      order: {
        [sortBy]: order,
      },
      take: take,
      skip: skip,
    };
    if (nameFilter) {
      options.where = {
        name: Like(`%${nameFilter}%`),
      };
    }
    const [categories, total] = await this.findAndCount(options);
    return { categories, total };
  }
}
