import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
