-- seed.sql — optional local/dev seed data. Do NOT run against production.

insert into public.users (wallet_address, display_name, role)
values
  ('0x742d35cc6634c0532925a3b8d4c9b3a7d5e1c2f', 'Demo Seller', 'seller'),
  ('0x1234567890123456789012345678901234567890', 'Demo Buyer', 'buyer'),
  ('0x0000000000000000000000000000000000000001', 'Honra Admin', 'admin')
on conflict (wallet_address) do nothing;

insert into public.products (seller_id, title, description, price_usdc, stock, category, status)
select id, 'Sample Product', 'A sample product for local testing.', 320.000000, 10, 'general', 'active'
from public.users
where wallet_address = '0x742d35cc6634c0532925a3b8d4c9b3a7d5e1c2f'
on conflict do nothing;
