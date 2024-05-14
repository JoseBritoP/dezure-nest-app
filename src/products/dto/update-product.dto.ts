import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(4,{ message: 'The product name is too short'})
  @MaxLength(30,{ message: 'The product name is too long'})
  name?:string

  @IsOptional()
  @IsInt()
  @IsNumber()
  price?:number
 
  @IsOptional()
  @IsBoolean()
  inStock?:boolean
}
