import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
