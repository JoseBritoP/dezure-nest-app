import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ManageProductsService } from './manage-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/users/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ReqUser } from 'src/types/payload';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description:'Unauthorized Bearer Auth',
  status:401
})
@ApiTags('Manage Products')
@UseGuards(AuthGuard)
@Controller('manage-products')
export class ManagerProductsController {
  constructor(private readonly productsService: ManageProductsService) {}
  @Post('create')
  create(@Body() createProductDto: CreateProductDto, @Request() req:ReqUser) {
    return this.productsService.create(createProductDto,req.user);
  }

  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,@Request() req:ReqUser) {
    return this.productsService.update(+id, updateProductDto,req.user);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Request() req:ReqUser) {
    return this.productsService.remove(+id,req.user);
  }
}
