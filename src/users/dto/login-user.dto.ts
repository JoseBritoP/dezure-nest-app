import { IsEmail, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class LoginUserDto {
  @ApiProperty({
    default:'swagger@gmail.com',
    description:""
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;
  @ApiProperty({
    default:"Pass12345",
    description:""
  })
  @IsNotEmpty()
  @IsString()
  password: string;

}