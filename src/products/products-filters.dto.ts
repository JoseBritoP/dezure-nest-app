import { IsOptional, IsString } from "class-validator";

export class QueryValuesDto {
  @IsOptional()
  @IsString()
  limit?:string
  @IsString()
  @IsOptional()
  page?:string
  @IsOptional()
  name?: string;
  @IsOptional()
  minPrice?: string;
  @IsOptional()
  maxPrice?: string;
  @IsOptional()
  inStock?: string;
  @IsOptional()
  creatorId?: string;
}