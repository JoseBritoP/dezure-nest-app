import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    default:"Product Swagger",
    description:"Nombre del producto"
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name:string

  @ApiProperty({
    default:24,
    description:"Descripción breve del producto"
  })
  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @Min(1)
  @Max(9999)
  price:number

  @ApiProperty({
    description:"El id del usuario al que le pertenece el producto"
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  creatorId:number
}