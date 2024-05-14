import { IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name:string

  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @Min(1)
  @Max(9999)
  price:number

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  creatorId:number
}