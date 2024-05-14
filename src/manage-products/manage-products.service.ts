import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/types/payload';

@Injectable()
export class ManageProductsService {
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

  async findOne(id: number) {

    const product = await this.productRepository.findOne({
      where:{
        id
      },
      select:{
        creator:{
          id:true,
          username:true
        }
      }
    });

    if(!product) return new HttpException('Product not found',HttpStatus.NOT_FOUND);

    return product

  }

  async update(id: number, updateProductDto: UpdateProductDto,user:UserType) {
    console.log(updateProductDto)
    const productToUpdate = await this.productRepository.findOne({
      where:{
        id
      }
    });

    if(!productToUpdate) return new HttpException('Product not Found',HttpStatus.NOT_FOUND);

    if(user.id === productToUpdate.creatorId) return new HttpException('Unauthorized',HttpStatus.UNAUTHORIZED);
    
    const productUpdated = await this.productRepository.save({
      ...productToUpdate,
      ...updateProductDto
    });

    return productUpdated

  }

  async remove(id: number,user:UserType) {

    const productToDelete = await this.productRepository.findOne({
      where:{
        id
      }
    });

    if(!productToDelete) return new HttpException('Product not found',HttpStatus.NOT_FOUND);

    const isOwnerOrAdmin = user.id === productToDelete.creatorId  || user.rol === 'admin';
    if (!isOwnerOrAdmin) return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    await this.productRepository.delete(id);

    return {
      message: `The user #${id} was successfully deleted`,
      productDeleted: productToDelete,
    }

  }
}
