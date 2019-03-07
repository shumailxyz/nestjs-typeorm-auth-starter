import { IsNotEmpty, IsEmail, Length } from 'class-validator';
// todo: validate properly

export class CreateUserDto {

  @Length(1)
  readonly firstName: string;

  @Length(1)
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @Length(6)
  readonly password: string;

  // todo: custom web3 eth address validator
  @IsNotEmpty()
  readonly ethWalletAddress: string;
}
