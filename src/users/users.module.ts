import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserUtilsModule } from './utils/users-utils.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret:process.env.SECRET || 'secret',
    signOptions:{expiresIn:'180d'}
  }),
  UserUtilsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})

export class UsersModule {}
