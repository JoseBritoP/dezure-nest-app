import { IsEmail, IsEnum, IsInt, IsNotEmpty, Matches, MaxLength, MinLength} from 'class-validator';
import { UserGender } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegEx = /^(?=.*[0-9])(?=.*[A-Z]).{4,20}$/

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @MaxLength(20,{ message: 'Username is too long' })
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain minimum 4 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  age: number;

  @ApiProperty()
  @IsEnum(UserGender)
  gender: UserGender;

}
