import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
// todo: validate properly

export class CreateUserDto {

  @ApiModelProperty()
  @Length(1)
  readonly firstName: string;

  @ApiModelProperty()
  @Length(1)
  readonly lastName: string;

  @ApiModelProperty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty({minLength: 6})
  @Length(6)
  readonly password: string;

  // todo: custom web3 eth address validator
  @ApiModelProperty()
  @IsNotEmpty()
  readonly ethWalletAddress: string;
}
