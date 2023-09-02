import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateProductDto {

  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  preparationTime: number;

  @IsString()
  @IsNotEmpty()
  lang: string;

}