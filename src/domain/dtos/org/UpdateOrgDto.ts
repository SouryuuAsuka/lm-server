import { IsString } from 'class-validator';

export class UpdateOrgDto {
  @IsString()
  lang: string;

  @IsString()
  name: string;

  @IsString()
  about: string;

  @IsString()
  category: string;

  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsString()
  house: string;

  @IsString()
  flat: string;
}
