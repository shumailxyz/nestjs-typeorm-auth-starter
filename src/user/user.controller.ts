import { Controller, Get, Param, Put, Body, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard())
export class UserController {

  constructor(private readonly userService: UserService) { }

  /**
   * Get all users
   */
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  /**
   * Create a new user
   * Normally, users will sign up using the signup route in Auth module. This route is for special purposes (e.g. Admin creates new user himself)
   * @param userData User attributes
   */
  @Post()
  async create(@Body() userData: CreateUserDto): Promise<User> {
    return await this.userService.create(userData);
  }

  /**
   * Get user by id
   * @param id user id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  /**
   * Update a user
   * @param id user id
   * @param userData User info to update
   */
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, userData);
  }

}
