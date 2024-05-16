import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateAuthDto, UpdateAuthPasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/types/payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserData: RegisterUserDto) {
    const { password, username, email } = registerUserData;

    await this.checkUserExistence(username, email);

    const passwordHash = await hash(password, 8);
    registerUserData.password = passwordHash;

    const user = this.userRepository.create(registerUserData);
    return this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const findUser = await this.findUserByEmail(loginUserDto.email, true);
    if(findUser instanceof HttpException) return findUser;

    await this.verifyPassword(loginUserDto.password, findUser.password);

    const payload = this.createPayload(findUser);
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
    const user = await this.findUserById(id);
    return user;
  }

  async updateProfileInfo(id: number, authId: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.findUserById(id);
    if(userToUpdate instanceof HttpException) return userToUpdate;

    this.checkOwnership(userToUpdate.id, authId);

    return this.userRepository.save({ ...userToUpdate, ...updateUserDto });
  }

  async updateAuthCredentials(id: number, authId: number, updateUserDto: UpdateAuthDto) {
    const userToUpdate = await this.findUserById(id);
    if(userToUpdate instanceof HttpException ) return userToUpdate;
    this.checkOwnership(userToUpdate.id, authId);

    const checkUser = await this.checkUserExistence(updateUserDto.username, updateUserDto.email);
    if(checkUser instanceof HttpException) return checkUser;

    userToUpdate.username = updateUserDto.username ? updateUserDto.username : userToUpdate.username 
    userToUpdate.email = updateUserDto.email ? updateUserDto.email : userToUpdate.email

    return this.userRepository.save(userToUpdate);
  }

  async updateAuthPassword(id:number,authId:number,updateAuthPasswordDto:UpdateAuthPasswordDto){
    const user = await this.userRepository.findOne({
      where:{
        id
      }
    });

    if(!user) return new HttpException('User not found',HttpStatus.NOT_FOUND)
    if(user.id !== authId) return new HttpException('Unauthorized',HttpStatus.UNAUTHORIZED);

    const passwordCheck = await this.verifyPassword(updateAuthPasswordDto.currentPassword, user.password);
    
    if(passwordCheck instanceof HttpException) return passwordCheck;

    if(updateAuthPasswordDto.newPassword !== updateAuthPasswordDto.repeatPassword) return new HttpException('The password must match',HttpStatus.BAD_REQUEST);

    const passwordHash = await hash(updateAuthPasswordDto.newPassword,8);
    user.password = passwordHash

    await this.userRepository.save(user);

    return {
      message:'The password was successfully updated!'
    }
  }

  async remove(id: number, authUser: UserType) {
    const userToDelete = await this.findUserById(id);

    this.checkAdminOrOwnership(authUser, id);

    await this.userRepository.delete(id);
    return {
      message: `The user #${id} was successfully deleted`,
      userDeleted: userToDelete,
    };
  }

  private async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'age', 'gender'],
    });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  private async findUserByEmail(email: string, includePassword = false) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: includePassword ? ['id', 'username', 'email', 'password', 'rol'] : ['id', 'username', 'email', 'rol'],
    });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  private async checkUserExistence(username: string, email: string) {
    const userExist = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExist) return new HttpException('User already exist', HttpStatus.CONFLICT);
  }

  private async verifyPassword(inputPassword: string, storedPassword: string) {
    const isPasswordValid = await compare(inputPassword, storedPassword);

    if (!isPasswordValid) return new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);
  }

  private checkOwnership(userId: number, authId: number) {
    if (userId !== authId) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  private checkAdminOrOwnership(authUser: UserType, userId: number) {
    const isOwnerOrAdmin = authUser.id === userId || authUser.rol === 'admin';
    if (!isOwnerOrAdmin) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  private createPayload(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol,
    };
  }

}