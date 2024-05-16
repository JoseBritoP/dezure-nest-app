import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import { UserGender } from '../entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
const passwordRegEx = /^(?=.*[0-9])(?=.*[A-Z]).{4,20}$/

export class UpdateUserDto {
  @ApiPropertyOptional({
    description:"Update user's age",
    default:24,
    type:Number
  })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiPropertyOptional({
    type:String,
    description:"Update user's gender",
    enum:["male","female","unspecified"],
    default:"male"
  })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;
}

export class UpdateAuthDto {
  @ApiPropertyOptional({
    type:String,
    description:"Update username",
    default:"DezureUPD"
  })
  @IsOptional()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @MaxLength(20,{ message: 'Username is too long' })
  username?: string;

  @ApiPropertyOptional({
    type:String,
    description:"Update email",
    default:"dezureupd@gmail.com"
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email?: string;
}

export class UpdateAuthPasswordDto {
  @ApiProperty({
    description:"Set current password",
    type:String,
    example:"Pass123!",
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  currentPassword:string

  @ApiProperty({
    description:"Set new password",
    type:String,
    default:"",
    required:true,
    example:"NewPass123!"
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(passwordRegEx, {
    message: `Password must contain minimum 4 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  newPassword:string

  @ApiProperty({
    description:"Repeat your new password",
    type:String,
    default:"",
    required:true,
    example:"NewPass123!"
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(passwordRegEx, {
    message: `Password must contain minimum 4 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  repeatPassword:string
}