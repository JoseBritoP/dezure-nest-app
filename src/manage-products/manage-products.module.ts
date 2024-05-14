import { Module } from '@nestjs/common';
import { ProductsService } from './manage-products.service';
import { ManagerProductsController } from './manage-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([Product]),
    JwtModule.register({
      secret:process.env.SECRET || 'secret',
      signOptions:{expiresIn:'180d'}
    }),
    UsersModule
  ],
  controllers: [ManagerProductsController],
  providers: [ProductsService],
})
export class ManageProductsModule {}
