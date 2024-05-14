import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Auth
  @Post('register')
  create(@Body() createUserDto: RegisterUserDto) {
    return this.usersService.register(createUserDto);
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

  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('profile/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('profile/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
