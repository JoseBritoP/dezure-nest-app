import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateAuthDto, UpdateAuthPasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/types/payload';
import { UserUtilsService } from './utils/users-utils.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userUtilsService: UserUtilsService,
  ) {}

  async registerAccount(registerUserData: RegisterUserDto) {
    const { password, username, email } = registerUserData;

    const checkUser = await this.userUtilsService.checkUserExistence(username, email);

    if (checkUser instanceof HttpException) return checkUser;
    const passwordHash = await hash(password, 8);
    registerUserData.password = passwordHash;

    const user = this.userRepository.create(registerUserData);
    return this.userRepository.save(user);
  }

  async loginAccount(loginUserDto: LoginUserDto) {
    const findUser = await this.userUtilsService.findUserByEmail(loginUserDto.email, true);
    if (findUser instanceof HttpException) return findUser;

    const check = await this.userUtilsService.verifyPassword(loginUserDto.password, findUser.password);
    if (check instanceof HttpException) return check;

    const payload = this.userUtilsService.createPayload(findUser);
    const token = this.jwtService.sign(payload);

    return { token, user: findUser };
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: ['id', 'username', 'email', 'age', 'gender'],
    });

    if (!users.length) return new HttpException('Not found', HttpStatus.NOT_FOUND);
    return users;
  }

  async getProfile(id: number) {
    const user = await this.userUtilsService.findUserById(id);
    return user;
  }

  async updateProfileInfo(id: number, authId: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userUtilsService.findUserById(id);
    if (userToUpdate instanceof HttpException) return userToUpdate;

    if (userToUpdate.id !== authId) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.userRepository.save({ ...userToUpdate, ...updateUserDto });
  }

  async updateAuthCredentials(id: number, authId: number, updateUserDto: UpdateAuthDto) {
    const userToUpdate = await this.userUtilsService.findUserById(id);
    if (userToUpdate instanceof HttpException) return userToUpdate;
  
    if (userToUpdate.id !== authId) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    if (userToUpdate.email === updateUserDto.email || userToUpdate.username === updateUserDto.username) return new HttpException('Same credentials',HttpStatus.BAD_REQUEST)
    
    const checkUser = await this.userUtilsService.checkUserExistence(updateUserDto.username, updateUserDto.email);
    
    if (checkUser instanceof HttpException) return checkUser;
  
    const { username = userToUpdate.username, email = userToUpdate.email } = updateUserDto;
  
    return this.userRepository.save({ ...userToUpdate, username, email });
  }
  

  async updateAuthPassword(id: number, authId: number, updateAuthPasswordDto: UpdateAuthPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user.id !== authId) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const passwordCheck = await this.userUtilsService.verifyPassword(updateAuthPasswordDto.currentPassword, user.password);

    if (passwordCheck instanceof HttpException) return passwordCheck;

    if (updateAuthPasswordDto.newPassword !== updateAuthPasswordDto.repeatPassword) return new HttpException('The password must match', HttpStatus.BAD_REQUEST);

    const passwordHash = await hash(updateAuthPasswordDto.newPassword, 8);
    user.password = passwordHash;

    await this.userRepository.save(user);

    return {
      message: 'The password was successfully updated!',
    };
  }

  async deleteProfile(id: number, authUser: UserType) {
    const userToDelete = await this.userUtilsService.findUserById(id);

    this.userUtilsService.checkAdminOrOwnership(authUser, id);

    await this.userRepository.softDelete(id);
    return {
      message: `The user #${id} was successfully deleted`,
      userDeleted: userToDelete,
    };
  }
}
