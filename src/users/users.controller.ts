import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateAuthDto, UpdateAuthPasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from './jwt-auth.guard';
import { ReqUser } from 'src/types/payload';

@ApiTags('Auth')
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Auth
  @Post('register')
   create(@Body() createUserDto: RegisterUserDto) {
    return  this.usersService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  // User
  @UseGuards(AuthGuard)
  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.getProfile(+id);
  }

  // Update
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description:'Unauthorized Bearer Auth',
    status:401
  })
  @UseGuards(AuthGuard)
  @Patch('profile/:id')
  update(@Param('id') id: string, @Request() req:ReqUser, @Body() updateUserDto: UpdateUserDto) {
    const authId = req.user.id
    return this.usersService.updateProfileInfo(+id,authId, updateUserDto);
  }

  // UpdateCredentials
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({
    description:'Unauthorized Bearer Auth',
    status:401
  })
  @Patch('credentials/:id')
  updateAuth(@Param('id') id:string, @Request() req:ReqUser, @Body() updateAuthDto:UpdateAuthDto){
    const authId = req.user.id
    return this.usersService.updateAuthCredentials(+id,authId,updateAuthDto)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({
    description:'Unauthorized Bearer Auth',
    status:401
  })
  @Patch('change-password/:id')
  updatePassword(@Param('id') id:string,@Request() req:ReqUser,@Body() updatePassword:UpdateAuthPasswordDto){
    return this.usersService.updateAuthPassword(+id,req.user.id,updatePassword)
  }

  @Patch('')
  // Delete
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description:'Unauthorized Bearer Auth',
    status:401
  })
  @UseGuards(AuthGuard)
  @Delete('profile/:id')
  remove(@Param('id') id: string, @Request() req:ReqUser) {
    const authUser = req.user
    return this.usersService.remove(+id,authUser);
  }
}
