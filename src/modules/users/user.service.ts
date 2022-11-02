import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<User>,
  ) { }

  async create({
    name,
    email,
    is_admin,
    password,
  }: CreateUserDTO): Promise<User> {
    const userExists = await this.usersRepository.findOne({ where: { email } });

    if (userExists) throw new BadRequestException('Email already in use.');

    const passwordHash = await hash(password, 8);

    const user = this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      is_admin,
    });

    return await this.usersRepository.save(user);
  }

  async findUserByEmail(email: string, getPassword?: boolean): Promise<User> {
    let user: User;

    if (getPassword) {
      user = await this.usersRepository
        .createQueryBuilder('user')
        .select('user.id')
        .addSelect('user.name')
        .addSelect('user.email')
        .addSelect('user.password')
        .where('user.email = :email', { email: email })
        .getOne();
    } else
      user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException('Email does not exist.');

    return user;
  }
}
