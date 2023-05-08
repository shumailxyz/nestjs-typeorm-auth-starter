import { Body, Controller, Get, Param, Post, Put, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { messages } from '../common/i18n/en/messages';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard())
export class UserController {

  constructor(private readonly userService: UserService) { }

  /**
   * Get all users
   */
  @Get()
  @ApiOperation({ summary: messages.apidocs.users.getAllUsersTitle , description: messages.apidocs.users.getAllUsersDesc })
  @ApiResponse({ status: HttpStatus.OK, type: User, isArray: true, description: messages.apidocs.general.success })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  /**
   * Create a new user
   * Normally, users will sign up using the signup route in Auth module. This route is for special purposes (e.g. Admin creates new user himself)
   * @param userData User attributes
   */
  @Post()
  @ApiOperation({ summary: messages.apidocs.users.createUserTitle, description: messages.apidocs.users.createUserDesc })
  @ApiResponse({ status: HttpStatus.OK, type: User, description: messages.apidocs.general.success })
  async create(@Body() userData: CreateUserDto): Promise<User> {
    return await this.userService.create(userData);
  }

  /**
   * Get user by id
   * @param id user id
   */
  @Get(':id')
  @ApiOperation({ summary: messages.apidocs.users.getUserByIdTitle, description: messages.apidocs.users.getUserByIdDesc })
  @ApiResponse({ status: HttpStatus.OK, type: User, description: messages.apidocs.general.success })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }

  /**
   * Update a user
   * @param id user id
   * @param userData User info to update
   */
  @Put(':id')
  @ApiOperation({ summary: messages.apidocs.users.updateUserTitle, description: messages.apidocs.users.updateUserDesc })
  @ApiResponse({ status: HttpStatus.OK, type: User, description: messages.apidocs.general.success })
  async updateOne(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, userData);
  }

}
