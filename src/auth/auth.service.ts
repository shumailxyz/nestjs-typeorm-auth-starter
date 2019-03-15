import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@app/config/config.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
          expiresIn: this.configService.jwtExpiresIn,
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
