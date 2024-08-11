import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/common/entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async registerUser(user: User) {
    const newUser = await this.usersService.create(user);
    const tokenData = this.generateJwtToken(newUser);

    return { ...tokenData, ...newUser };
  }

  async signInUser(user: User) {
    const currentUser = await this.usersService.findOneByEmail(user.email);

    if (!currentUser) {
      return this.registerUser(user);
    }

    const tokenData = this.generateJwtToken(user);

    return { ...tokenData, ...currentUser };
  }

  generateJwtToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
