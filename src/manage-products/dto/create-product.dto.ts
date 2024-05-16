import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    default:"Swagger Product",
    description:"Product's name",
    type:String,
    example:"Product Test"
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name:string

  @ApiProperty({
    default:24,
    description:"Product's price",
    example:30,
    type:Number
  })
  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @Min(1)
  @Max(9999)
  price:number

  @ApiProperty({
    type:Number,
    description:"The creator/owner id of product",
    example:4
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  creatorId:number
}