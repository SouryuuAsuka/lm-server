import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CartCookiesDto {
  @IsNumber()
  @IsNotEmpty()
  cart_id: number;

  @IsString()
  @IsNotEmpty()
  cart_token: string;
}
