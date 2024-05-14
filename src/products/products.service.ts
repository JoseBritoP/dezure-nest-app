import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/types/payload';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) 
    private productRepository:Repository<Product>,
    private usersService:UsersService
  ){}

  async create(createProductDto: CreateProductDto,user:UserType) {

    const creator = await this.usersService.findOne(createProductDto.creatorId);

    // Si creator es una HttpException, significa que ocurrió un error al buscar al creador del producto
    if (creator instanceof HttpException) return creator
  
    // Si el ID del creador no coincide con el ID del usuario actual
    if (creator.id !== user.id) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const newProduct = this.productRepository.create(createProductDto);

    return this.productRepository.save(newProduct);

  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto)
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
