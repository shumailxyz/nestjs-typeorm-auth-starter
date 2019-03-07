import { Controller, Get, UseGuards, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@app/user/dto';
import { User } from '@app/user/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { messages } from '@app/common/i18n/en/messages';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  /**
   * User sign up
   * @param userData User data attributes
   */
  @Post('signup')
  @ApiOperation({ title: messages.apidocs.auth.signupTitle , description: messages.apidocs.auth.signupDesc })
  @ApiResponse({ status: HttpStatus.OK, type: User, description: messages.apidocs.general.success })
  async signUp(@Body() userData: CreateUserDto): Promise<User> {
    return await this.authService.signUp(userData);
  }

  // todo: return type
  /**
   * User login & get JWT token
   * @param req request body. Should have email & password
   */
  @Post('login')
  @ApiOperation({ title: messages.apidocs.auth.loginTitle , description: messages.apidocs.auth.loginDesc })
  @ApiResponse({ status: HttpStatus.OK, type: User, description: messages.apidocs.general.success })
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  /**
   * Test route for Guard
   * todo: remove this route
   */
  @Get('protected')
  @UseGuards(AuthGuard())
  async protected() {
    return 'hello protected';
  }
}
