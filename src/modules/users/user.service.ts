import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { validate } from 'uuid';
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

    if (userExists) throw new BadRequestException('Email já cadastrado.');

    const passwordHash = await hash(password, 8);

    const createdUser = this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      is_admin,
    });

    const user = await this.usersRepository.save(createdUser);

    delete user.password;

    return user;
  }

  async findUserByEmail(email: string, getPassword?: boolean): Promise<User> {
    let user: User;

    if (getPassword) {
      user = await this.usersRepository
        .createQueryBuilder('user')
        .select('user.id')
        .addSelect('user.name')
        .addSelect('user.email')
        .addSelect('user.is_admin')
        .addSelect('user.password')
        .where('user.email = :email', { email: email })
        .getOne();
    } else user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException('Email não encontrado.');

    return user;
  }

  async findUserById(id: string): Promise<User> {
    if (!validate(id)) {
      throw new BadRequestException('Informe um ID válido.');
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }
}
