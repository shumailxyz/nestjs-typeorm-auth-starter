import { IsEmail, IsOptional, Min, Length } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @Length(1)
  readonly firstName: string;

  @IsOptional()
  @Length(1)
  readonly lastName: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @Length(6)
  readonly oldPassword: string;

  @IsOptional()
  @Length(6)
  readonly newPassword: string;

  // todo: eth web3 validator
  @IsOptional()
  readonly ethWalletAddress: string;
}
