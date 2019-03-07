import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { UpdateUserDto, CreateUserDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  /**
   * Inserts a new User into the database.
   * @param userData user attributes in request body
   */
  async create(userData: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.ethWalletAddress = userData.ethWalletAddress;
    user.password = await bcrypt.hash(userData.password, 10);

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Returns array of all users from db
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Returns a user by given id
   */
  async getById(id: string | number): Promise<User> {
    let user: User;
    try {
      user = await this.userRepository.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
    if (!user) {
      throw new NotFoundException(`User with ${id} does not exist`);
    }
    return user;
  }

  /**
   * Returns a user by email
   */
  async getByEmail(email: string): Promise<User> {
    let users: User[];
    try {
      users = await this.userRepository.find({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new Error(error);
    }

    if (users && users.length > 0) {
      return users[0];  // typeorm find() returns array even if response is single object
    } else {
      throw new NotFoundException(`User with ${email} does not exist`);
    }
  }

  /**
   * Updates a user
   */
  async update(id: string, updateUserData: UpdateUserDto): Promise<User> {
    let userToUpdate: User;
    try {
      userToUpdate = await this.userRepository.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
    // if request body includes oldPassword & newPassword
    if (updateUserData.oldPassword && updateUserData.newPassword) {
      const isOldPasswordCorrect = await bcrypt.compare(updateUserData.oldPassword, userToUpdate.password);
      // if user provied wrong old password
      if (!isOldPasswordCorrect) {
        throw new BadRequestException('Old password is not correct.');
      } else {
      // user provied correct old password
      userToUpdate.password = await bcrypt.hash(updateUserData.newPassword, 10);
      }
    } else if ( (updateUserData.oldPassword && !updateUserData.newPassword) || (!updateUserData.oldPassword && updateUserData.newPassword)) {
      throw new BadRequestException('Provide both, old & new passwords or leave them empty if you want to update profile without changing password.');
    }

    const updated = Object.assign(userToUpdate, updateUserData);
    return await this.userRepository.save(updated);
  }

}
