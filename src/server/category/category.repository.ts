import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
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
  ) {
    const [categories, total] = await this.findAndCount({
      order: {
        [sortBy]: order,
      },
      take,
      skip,
    });
    return { categories, total };
  }
}
