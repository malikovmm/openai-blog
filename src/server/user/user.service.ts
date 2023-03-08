import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { UserRepository } from './user.repository';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findById(id: number) {
    return this.usersRepository.findById(id);
  }

  findOneBy(where: FindOneOptions<User>): Promise<User | null> {
    return this.usersRepository.findOne(where);
  }

  findBy(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User[]> {
    return this.usersRepository.findBy(where);
  }

  update(id: number, user: UpdateUserDto) {
    return this.usersRepository.update(id, user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
