import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';
import { QueryValuesDto } from './products-filters.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query() queryValues:QueryValuesDto
  ) {
    return this.productsService.findAll(queryValues);
  }
}
