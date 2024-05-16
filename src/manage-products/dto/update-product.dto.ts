import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    default:"Product edit",
    description:"Set the new name of the product",
    type:String
  })
  @IsOptional()
  @IsString()
  @MinLength(4,{ message: 'The product name is too short'})
  @MaxLength(30,{ message: 'The product name is too long'})
  name?:string

  @ApiPropertyOptional({
    default:19,
    description:"Set the new price of the product",
    type:Number
  })
  @IsOptional()
  @IsInt()
  @IsNumber()
  price?:number

  @ApiPropertyOptional({
    default:false,
    description:"Set if the product is availability or not",
    type:Boolean
  })
  @IsOptional()
  @IsBoolean()
  inStock?:boolean
}
