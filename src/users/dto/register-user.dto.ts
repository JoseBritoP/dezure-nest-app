import { IsEmail, IsEnum, IsInt, IsNotEmpty, Matches, MaxLength, MinLength} from 'class-validator';
import { UserGender } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegEx = /^(?=.*[0-9])(?=.*[A-Z]).{4,20}$/

export class RegisterUserDto {
  @ApiProperty({
    description:'Nombre de usuario',
    default:"Dezure",
    type:String
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @MaxLength(20,{ message: 'Username is too long' })
  username: string;

  @ApiProperty({
    description:'Correo',
    default:"dezure@gmail.com",
    type:String
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty({
    description:'Contraseña de registro',
    default:"Pass123!",
    type:String
  })
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain minimum 4 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @ApiProperty({
    description:'Edad del usuario',
    default:22,
    type:Number
  })
  @IsNotEmpty()
  @IsInt()
  age: number;

  @ApiProperty({ 
    enum: UserGender,
    examples:["male","female","unspecified"], 
    description: 'The gender of the user' 
  })
  @IsEnum(UserGender)
  gender: UserGender;
}
