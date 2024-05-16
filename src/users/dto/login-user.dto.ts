import { IsEmail, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class LoginUserDto {
  @ApiProperty({
    default:'dezure@gmail.com',
    description:"Email to signin",
    type:String
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty({
    default:"Pass123!",
    description:"Password to signin",
    type:String
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}