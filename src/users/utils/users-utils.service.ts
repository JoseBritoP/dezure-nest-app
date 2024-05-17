import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { UserType } from 'src/types/payload';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserUtilsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'age', 'gender'],
    });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async findUserByEmail(email: string, includePassword = false) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: includePassword ? ['id', 'username', 'email', 'password', 'rol'] : ['id', 'username', 'email', 'rol'],
    });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async checkUserExistence(username: string, email: string) {
    const userExist = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExist) return new HttpException('User already exists', HttpStatus.CONFLICT);
  }

  async verifyPassword(inputPassword: string, storedPassword: string) {
    const isPasswordValid = await compare(inputPassword, storedPassword);

    if (!isPasswordValid) return new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);
  }


  checkAdminOrOwnership(authUser: UserType, userId: number) {
    const isOwnerOrAdmin = authUser.id === userId || authUser.rol === 'admin';
    if (!isOwnerOrAdmin) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  createPayload(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol,
    };
  }
}
