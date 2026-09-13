import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findById(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('User not found');
    return data;
  }

  async update(id: string, dto: UpdateUserDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .update({
        display_name: dto.displayName,
        email: dto.email,
        avatar_url: dto.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }
}
