import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/manage-products/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductsFiltersDto } from './products-filters.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) 
    private productRepository:Repository<Product>
  ){}

  
  async findAll(limit:string,page:string,filters:ProductsFiltersDto){


    console.log(filters);
    const limitValue = Number(limit) <= 0 || limit === undefined || Number.isNaN(+limit) ? 5 : Number(limit);
    const pageValue =  Number(page)  <= 0 || page  === undefined || Number.isNaN(+page) ? 1 : Number(page);
    
    const skip = (pageValue-1) * limitValue;

    if(Number.isNaN(skip)) return new HttpException('Invalid values',HttpStatus.BAD_REQUEST);
    

    const products = await this.productRepository.find({
      skip,
      take:limitValue    
    });

    const productsCount = await this.productRepository.count();

    return {
      limit:limitValue,
      currentPage:pageValue,
      totalPages:productsCount/limitValue,
      data:products
    }
  }
}
