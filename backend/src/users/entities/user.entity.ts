export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  wallet_address: string;
  display_name: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
