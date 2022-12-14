import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UserPayload } from './dtos/UserPayload';
import { UserToken } from './dtos/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      avatar: user.avatar,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
      is_admin: payload.is_admin,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email, true);

    if (user) {
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedError('Endereço de email ou senha incorretos.');
  }
}
