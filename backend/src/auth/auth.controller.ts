import { Controller, Get, UseGuards, Post, Body, Req, HttpStatus, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { messages } from '../common/i18n/en/messages';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  /**
   * User sign up
   * @param userData User data attributes
   */
  @Post('signup')
  @ApiOperation({ summary: messages.apidocs.auth.signupTitle , description: messages.apidocs.auth.signupDesc })
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
  @ApiOperation({ summary: messages.apidocs.auth.loginTitle , description: messages.apidocs.auth.loginDesc })
  @ApiResponse({ status: HttpStatus.OK, type: User, description: messages.apidocs.general.success })
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  /**
   * Test route for Guard
   * todo: remove this route
   */
  @Get('protected')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async protected(@Request() r: any) {
    return 'hello protected user: ' + r.user?.email;
  }
}
