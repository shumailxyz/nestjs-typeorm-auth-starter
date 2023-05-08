import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(userData: CreateUserDto): Promise<User> {
    return await this.userService.create(userData);
  }

  // todo: return type
  async login(loginUserData: LoginUserDto) {
    const user = await this.userService.findOneByEmail(loginUserData.email);
    if (!user) {
      throw new UnauthorizedException(`User with ${loginUserData.email} does not exist`, 'unknown_user');
    }
    // if user found
    if (user) {
      // compare password
      const isPasswordCorrect = await bcrypt.compare(loginUserData.password, user.password);
      // if password is correct
      if (isPasswordCorrect) {
        const accessToken = this.jwtService.sign({
          id: user.id,
          email: user.email,
        });
        return {
          expiresIn: 86400,
          token: accessToken,
        };
      } else {  // if password is incorrect
        throw new UnauthorizedException('Incorrect password.');
      }
    }
  }

  /**
   * Validates a user using JWT token payload.
   * @param payload JWT token payload.
   */
  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.findOneByEmail(payload.email);
  }

}
