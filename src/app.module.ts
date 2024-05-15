import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManageProductsModule } from './manage-products/manage-products.module';
import { ProductsModule } from './products/products.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      password: process.env.DB_PASSWORD || '1234',
      username: process.env.DB_USERNAME || 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      database: process.env.DB_NAME || 'nest-int',
      synchronize: true,
      logging: false    
    }),
    UsersModule,
    ManageProductsModule,
    ProductsModule,
    ChatModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}