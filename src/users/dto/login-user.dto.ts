import { IsEmail, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class LoginUserDto {
  @ApiProperty({
    default:'dezure@gmail.com',
    description:"Email de ingreso",
    type:String
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty({
    default:"Pass123!",
    description:"Contraseña de ingreso",
    type:String
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}