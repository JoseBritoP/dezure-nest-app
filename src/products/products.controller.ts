import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('creatorId') creatorId?: number,
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('inStock') inStock?: string,
    @Query('limit')   limit?:string,
    @Query('page')    page?:string
  ) {

    const filters = {
      // creatorId,
      // name,
      // minPrice,
      // maxPrice,
      inStock
    }
    // console.log(filters)
    // return this.productsService.findAll(filters);


    return this.productsService.findAll(limit,page,filters);
  }
}
