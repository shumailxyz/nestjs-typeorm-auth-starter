import { IsNotEmpty } from 'class-validator';
// todo: fix validation

export class UpdateUserDto {

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
