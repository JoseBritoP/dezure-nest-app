import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryValuesDto } from './dto/products-filters.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of results to return',type:Number })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' ,type:Number})
  @ApiQuery({ name: 'name', required: false, description: 'Name of the product to filter by',type:String })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price of the product to filter by', type:Number })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price of the product to filter by', type:Number })
  @ApiQuery({ name: 'inStock', required: false, description: 'Indicates if the product is in stock (true/false)', type:Boolean })
  @ApiQuery({ name: 'creatorId', required: false, description: 'ID of the product creator to filter by',type:Number })
  findAll(
    @Query() queryValues: QueryValuesDto
  ) {
    return this.productsService.findAll(queryValues);
  }
}
