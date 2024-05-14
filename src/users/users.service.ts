import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/types/payload';
// TODO: SR / MD

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserData: RegisterUserDto) {
    const { password, username, email } = registerUserData;

    const userExist = await this.userRepository.findOne({
      where: [
        {
          username,
        },
        {
          email,
        },
      ],
    });

    if (userExist)
      return new HttpException('User already exist', HttpStatus.CONFLICT);

    const passwordHash = await hash(password, 8);
    registerUserData = { ...registerUserData, password: passwordHash };

    const user = this.userRepository.create(registerUserData);

    return this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        rol: true,
      },
    });

    if (!findUser)
      return new HttpException('User not found', HttpStatus.NOT_FOUND);

    const checkPassword = await compare(
      loginUserDto.password,
      findUser.password,
    );

    if (!checkPassword)
      return new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);

    const payload = {
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
      rol: findUser.rol,
    };

    const token = this.jwtService.sign(payload);

    const data = {
      token,
      user: findUser,
    };

    return data;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        age: true,
        gender: true,
      },
    });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async update(id: number, authId: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        age: true,
        gender: true,
      },
    });

    if (!userToUpdate)
      return new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (userToUpdate.id !== +authId)
      return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    // Actualizar y devolver el objeto
    const userUpdated = await this.userRepository.save({
      ...userToUpdate,
      ...updateUserDto,
    });

    return userUpdated;
  }

  async remove(id: number, authUser: UserType) {
    const userToDelete = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userToDelete) return new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isOwnerOrAdmin = authUser.id === id || authUser.rol === 'admin';

    if (!isOwnerOrAdmin) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    await this.userRepository.delete(id);
    return {
      message: `The user #${id} was successfully deleted`,
      userDeleted: userToDelete,
    };
  }
}
