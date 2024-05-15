import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import { UserGender } from '../entities/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
const passwordRegEx = /^(?=.*[0-9])(?=.*[A-Z]).{4,20}$/

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;
}

export class UpdateAuthDto {
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @MaxLength(20,{ message: 'Username is too long' })
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Matches(passwordRegEx, {
    message: `Password must contain minimum 4 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password?: string;

}