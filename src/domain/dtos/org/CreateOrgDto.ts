import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrgDto {
  @IsString()
  @IsNotEmpty()
  lang: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  house: string;

  @IsString()
  @IsNotEmpty()
  flat: string;
}
