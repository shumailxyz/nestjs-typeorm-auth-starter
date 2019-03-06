import { IsNotEmpty } from 'class-validator';
// todo: validate properly

export class CreateUserDto {

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly ethWalletAddress: string;
}
