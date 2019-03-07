import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginUserDto {

  @ApiModelProperty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly password: string;
}
