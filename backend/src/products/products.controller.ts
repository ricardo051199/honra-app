import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthTokenPayload } from '../auth/auth.service.js';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@ApiTags('products')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  list(@Query('category') category?: string, @Query('status') status?: string) {
    return this.productsService.list({ category, status });
  }

  @Get('products/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get('seller/products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  listMine(@CurrentUser() user: AuthTokenPayload) {
    return this.productsService.listBySeller(user.sub);
  }

  @Post('products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  create(@CurrentUser() user: AuthTokenPayload, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.sub, dto);
  }

  @Patch('products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthTokenPayload,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, user.sub, dto);
  }

  @Delete('products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  remove(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload) {
    return this.productsService.remove(id, user.sub);
  }
}
