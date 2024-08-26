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

  async registerUser(user: Pick<User, 'name' | 'email'>) {
    const newUser = await this.usersService.create(user);
    const tokenData = this.generateJwtToken(newUser);

    return { ...tokenData, ...newUser };
  }

  async signInUser(user: User) {
    const currentUser = await this.usersService.findOneByEmail(user.email);

    if (!currentUser) {
      return this.registerUser(user);
    }

    if (currentUser.inactive) {
      await this.usersService.activate(currentUser.id);
    }

    const tokenData = this.generateJwtToken(user);

    return { ...tokenData, ...currentUser };
  }

  async updateUserSession(userId: string, body: Partial<User>) {
    const currentUser = await this.usersService.update(userId, body);
    const tokenData = this.generateJwtToken(currentUser);

    return { ...tokenData, ...currentUser };
  }

  generateJwtToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  decodeJwtToken(token: string) {
    return this.jwtService.decode(token);
  }
}
