// src/utils/utils.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserUtilsService } from './users-utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserUtilsService],
  exports: [UserUtilsService],
})
export class UserUtilsModule {}
