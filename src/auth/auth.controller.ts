import { Controller, Get, UseGuards, Post, Body, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@app/user/dto';
import { User } from '@app/user/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  /**
   * User sign up
   * @param userData User data attributes
   */
  @Post('signup')
  public async signUp(@Body() userData: CreateUserDto): Promise<User> {
    return await this.authService.signUp(userData);
  }

  // todo: return type
  /**
   * User login & get JWT token
   * @param req request body. Should have email & password
   */
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  /**
   * Test route for Guard
   */
  @Get('protected')
  @UseGuards(AuthGuard())
  public async protected() {
    return 'hello protected';
  }
}
