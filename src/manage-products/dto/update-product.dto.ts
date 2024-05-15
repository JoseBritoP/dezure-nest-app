import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(4,{ message: 'The product name is too short'})
  @MaxLength(30,{ message: 'The product name is too long'})
  name?:string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsNumber()
  price?:number
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inStock?:boolean
}
