import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateAuthDto, UpdateAuthPasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from './jwt-auth.guard';
import { ReqUser } from 'src/types/payload';
import { User } from './entities/user.entity';

class PostAuth {
  token:string
  user:User
}

@ApiTags('Auth')
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Auth
  // Swagger
  @ApiResponse({
    status:201,
    type:User || HttpException,
    description:'Account created successfully',
  })
  //? Register
  @Post('register')
   create(@Body() createUserDto: RegisterUserDto) {
    return  this.usersService.registerAccount(createUserDto);
  }

  // Swagger
  @ApiResponse({
    status:201,
    description:'Account logged successfully',
    type:PostAuth
  })
  @ApiBadRequestResponse({
    status:400,
    description:'Bad credentials'
  })
  //? Login
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginAccount(loginUserDto);
  }

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  // Profile
  // Swagger
  @ApiResponse({
    status:200,
    type:User,
    description:'Get the profile user'
  })
  @ApiBadRequestResponse({
    status:404,
    description:"Profile of user not found",
    type:HttpException
  })
  @UseGuards(AuthGuard)
  //? Profile
  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.getProfile(+id);
  }

  // Update
  // Swagger
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description:'Unauthorized Bearer Auth',
    status:401
  })
  @ApiResponse({
    status:200,
    type: User || HttpException,
    description:"Update the user info"
  })
  @ApiBadRequestResponse({
    status:400 || 404,
    type:HttpException,
    description:"Bad request - User not found"
  })
  @UseGuards(AuthGuard)
  //? Profile Update
  @Patch('profile/:id')
  update(@Param('id') id: string, @Request() req:ReqUser, @Body() updateUserDto: UpdateUserDto) {
    const authId = req.user.id
    return this.usersService.updateProfileInfo(+id,authId, updateUserDto);
  }

  // UpdateCredentials
  // Swagger
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({
    description:'Unauthorized Bearer Auth',
    status:401
  })
  @ApiResponse({
    description:"Update the auth credentials of user - email or username",
    status:200,
    type:User
  })
  @ApiBadRequestResponse({
    status:400,
    type:HttpException,
    description:"Bad Request - User not found"
  })
  //? Auth Credentials Update 
  @Patch('credentials/:id')
  updateAuth(@Param('id') id:string, @Request() req:ReqUser, @Body() updateAuthDto:UpdateAuthDto){
    const authId = req.user.id
    return this.usersService.updateAuthCredentials(+id,authId,updateAuthDto)
  }

  // Swagger
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({
    description:'Unauthorized Bearer Auth',
    status:401,
    type:HttpException
  })
  @ApiResponse({
    status:200,
    type: class Message {
      message:string
    },
    description:"Confirm new password to user"
  })
  @ApiBadRequestResponse({
    status:400 || 404,
    type:HttpException,
    description:"Password incorrect - User not found"
  })
  //? Auth - Password Update
  @Patch('change-password/:id')
  updatePassword(@Param('id') id:string,@Request() req:ReqUser,@Body() updatePassword:UpdateAuthPasswordDto){
    return this.usersService.updateAuthPassword(+id,req.user.id,updatePassword)
  }

  // Delete
  // Swagger
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description:'Unauthorized Bearer Auth',
    status:401
  })
  @ApiResponse({
    status:200,
    type:class Response {
      message:string
      userDeleted:User
    },
    description:"Account deleted successfully"
  })
  @ApiBadRequestResponse({
    status:400 || 404 || 401,
    description:"Bad Request - Unauthorized - Not Found",
    type:HttpException
  })
  @UseGuards(AuthGuard)
  //? Delete Profile
  @Delete('profile/:id')
  remove(@Param('id') id: string, @Request() req:ReqUser) {
    const authUser = req.user
    return this.usersService.deleteProfile(+id,authUser);
  }
}
