import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator';
import { UserGender } from '../entities/user.entity';

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @MaxLength(20,{ message: 'Username is too long' })
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @IsInt()
  age: number;

  @IsEnum(UserGender)
  @IsOptional()
  gender: UserGender;
}