import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import upload from 'src/config/upload';
import { Repository } from 'typeorm';
import { validate } from 'uuid';
import StorageProvider from '../storage/storage-provider-model';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<User>,

    @Inject('StorageProvider')
    private storageProvider: StorageProvider,
  ) {}

  async create({
    name,
    email,
    is_admin,
    password,
  }: CreateUserDTO): Promise<User> {
    const userExists = await this.usersRepository.findOne({ where: { email } });

    if (userExists) throw new BadRequestException('Email já cadastrado.');

    if (password.length < 6)
      throw new BadRequestException('Senha deve ter no mínimo 6 caracteres.');

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
        .addSelect('user.avatar')
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

  async updateAvatar(id: string, avatar: string): Promise<User> {
    if (avatar === '')
      throw new BadRequestException('Conteúdo enviado não é uma imagem.');

    const user = await this.findUserById(id);

    if (!user) {
      if (upload.driver === 'disk')
        await this.storageProvider.deleteFile(avatar);
      throw new NotFoundException('Trilha não encontrada.');
    }

    if (user.avatar) await this.storageProvider.deleteFile(user.avatar);

    const imageUrl = await this.storageProvider.saveFile(avatar);

    await this.usersRepository.update(
      { id },
      {
        avatar: imageUrl,
      },
    );

    return {
      ...user,
      avatar: imageUrl,
    };
  }

  async update(userData: UpdateUserDTO): Promise<User> {
    if (userData.email) {
      const userExists = await this.usersRepository.findOne({
        where: { email: userData.email },
      });

      if (userExists && userExists.id !== userData.id)
        throw new BadRequestException('Email já cadastrado.');
    }

    const user = await this.findUserById(userData.id);

    let passwordHash = '';

    if (userData.password) {
      if (userData.password.length < 6)
        throw new BadRequestException('Senha deve ter no mínimo 6 caracteres.');
      passwordHash = await hash(userData.password, 8);
    }

    await this.usersRepository.update(
      { id: user.id },
      {
        ...userData,
        password: userData.password ? passwordHash : userData.password,
      },
    );

    return {
      ...user,
      ...userData,
      password: '',
    };
  }

  async delete(id: string): Promise<void> {
    const userExists = await this.findUserByEmail(id);

    if (!userExists) throw new BadRequestException('Usuário não encontrado');

    await this.storageProvider.deleteFile(userExists.avatar);

    await this.usersRepository.delete(id);
  }
}
