import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly supabase: SupabaseService) {}

  async list(filters: { category?: string; status?: string } = {}) {
    let query = this.supabase.getClient().from('products').select('*').order('created_at', {
      ascending: false,
    });

    if (filters.category) query = query.eq('category', filters.category);
    query = query.eq('status', filters.status ?? 'active');

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('Product not found');
    return data;
  }

  async listBySeller(sellerId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async create(sellerId: string, dto: CreateProductDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('products')
      .insert({
        seller_id: sellerId,
        title: dto.title,
        description: dto.description,
        price_usdc: dto.priceUsdc,
        stock: dto.stock,
        category: dto.category,
        image_url: dto.imageUrl,
        status: 'active',
      })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, sellerId: string, dto: UpdateProductDto) {
    await this.assertOwnership(id, sellerId);

    const { data, error } = await this.supabase
      .getClient()
      .from('products')
      .update({
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.priceUsdc !== undefined && { price_usdc: dto.priceUsdc }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.imageUrl !== undefined && { image_url: dto.imageUrl }),
        ...(dto.status !== undefined && { status: dto.status }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  async remove(id: string, sellerId: string) {
    await this.assertOwnership(id, sellerId);
    const { error } = await this.supabase.getClient().from('products').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }

  private async assertOwnership(productId: string, sellerId: string) {
    const product = await this.findById(productId);
    if (product.seller_id !== sellerId) {
      throw new ForbiddenException('You do not own this product.');
    }
    return product;
  }
}
