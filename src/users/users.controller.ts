import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('api/auth')
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
    return this.usersService.findOne(+id);
  }

  // Update
  @UseGuards(AuthGuard)
  @Patch('profile/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // Delete
  @UseGuards(AuthGuard)
  @Delete('profile/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
