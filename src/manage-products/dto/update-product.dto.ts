import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    default:"Product edit",
    description:"Editar el nombre del producto"
  })
  @IsOptional()
  @IsString()
  @MinLength(4,{ message: 'The product name is too short'})
  @MaxLength(30,{ message: 'The product name is too long'})
  name?:string

  @ApiPropertyOptional({
    default:19,
    description:"Editar el precio del producto"
  })
  @IsOptional()
  @IsInt()
  @IsNumber()
  price?:number

  @ApiPropertyOptional({
    default:false,
    description:"Editar la disponibilidad del producto"
  })
  @IsOptional()
  @IsBoolean()
  inStock?:boolean
}
