import { IsEmail, IsEnum, IsInt, IsNotEmpty, Matches, MaxLength, MinLength} from 'class-validator';
import { UserGender } from '../entities/user.entity';

const passwordRegEx = /^(?=.*[0-9])(?=.*[A-Z]).{4,20}$/

export class RegisterUserDto {

  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @MaxLength(20,{ message: 'Username is too long' })
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain minimum 4 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @IsNotEmpty()
  @IsInt()
  age: number;

  @IsEnum(UserGender)
  gender: UserGender;

}
