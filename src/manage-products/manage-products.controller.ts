import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ManageProductsService } from './manage-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/users/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/types/payload';

@ApiTags('Manage Products')
@Controller('api/manage-products')
export class ManagerProductsController {
  constructor(private readonly productsService: ManageProductsService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req:ReqUser) {
    return this.productsService.create(createProductDto,req.user);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,@Request() req:ReqUser) {
    return this.productsService.update(+id, updateProductDto,req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req:ReqUser) {
    return this.productsService.remove(+id,req.user);
  }
}
