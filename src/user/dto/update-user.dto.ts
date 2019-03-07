import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {

  @ApiModelPropertyOptional()
  @IsOptional()
  @Length(1)
  readonly firstName: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @Length(1)
  readonly lastName: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @Length(6)
  readonly oldPassword: string;

  @ApiModelPropertyOptional({ minLength: 6})
  @IsOptional()
  @Length(6)
  readonly newPassword: string;

  // todo: eth web3 validator
  @ApiModelPropertyOptional()
  @IsOptional()
  readonly ethWalletAddress: string;
}
