import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/manage-products/entities/product.entity';
import {
  // Between, ILike, LessThanOrEqual, MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryValuesDto } from './products-filters.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async findAll({ limit, page, name, inStock, minPrice, maxPrice, creatorId }: QueryValuesDto) {

    const limitValue = Number(limit) <= 0 || limit === undefined || Number.isNaN(+limit) ? 5 : Number(limit);
    const pageValue =  Number(page) <= 0  || page  === undefined || Number.isNaN(+page)  ? 1 : Number(page);

    const skip = (pageValue - 1) * limitValue;

    if (Number.isNaN(skip)) return new HttpException('Invalid values', HttpStatus.BAD_REQUEST);

    const queryBuilder = this.productRepository.createQueryBuilder('product').skip(skip).take(limitValue);
    queryBuilder.orderBy('product.id','ASC')

    this.applyNameFilter(queryBuilder, name);
    this.applyInStockFilter(queryBuilder, inStock);
    this.applyPriceFilters(queryBuilder, minPrice, maxPrice);
    this.applyCreatorIdFilter(queryBuilder, creatorId);

    const [products, productsCount] = await queryBuilder.getManyAndCount();

    const filters = {
      name,
      inStock,
      minPrice: minPrice && parseInt(minPrice),
      maxPrice: maxPrice && parseInt(maxPrice),
      creatorId: creatorId && Number(creatorId),
    };

    return {
      limit: limitValue,
      currentPage: pageValue,
      totalPages: Math.ceil(productsCount / limitValue),
      totalItems: productsCount,
      filters: filters && filters,
      data: products,
    };
  }

  private applyNameFilter(queryBuilder: SelectQueryBuilder<Product>, name: string): void {
    if (name !== undefined) {
      queryBuilder.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }
  }

  private applyInStockFilter(queryBuilder: SelectQueryBuilder<Product>, inStock?: string): void {
    if (inStock && inStock !== undefined && inStock.length > 0) {
      const inStockValue = inStock.toLowerCase() === 'true';
      queryBuilder.andWhere('product.inStock = :inStock', { inStock: inStockValue });
    }
  }

  private applyPriceFilters(queryBuilder: SelectQueryBuilder<Product>,minPrice: string,maxPrice: string): void {
    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: +minPrice,
        maxPrice: +maxPrice,
      });
    } else if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: +minPrice,
      });
    } else if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: +maxPrice,
      });
    }
  }

  private applyCreatorIdFilter(queryBuilder: SelectQueryBuilder<Product>, creatorId: string): void {
    if (creatorId !== undefined) {
      queryBuilder.andWhere('product.creatorId = :creatorId', {
        creatorId: +creatorId,
      });
    }
  }
}
