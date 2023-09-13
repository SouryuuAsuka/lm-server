import { IsString, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
