import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateChatDto {
  @ApiProperty({
    description:"Mensaje para Langchain",
    default:"Dime los mejores consejos a la hora de hacer deporte"
  })
  @IsNotEmpty()
  @IsString()
  message:string
}
