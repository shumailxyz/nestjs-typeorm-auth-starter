import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty()
  @Length(1)
  readonly firstName: string;

  @ApiProperty()
  @Length(1)
  readonly lastName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({minLength: 6})
  @Length(6)
  readonly password: string;

  // todo: custom web3 eth address validator
  @ApiProperty()
  @IsNotEmpty()
  @Length(42, 42)
  readonly ethWalletAddress: string;
}
