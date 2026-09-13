import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';

export class NonceRequestDto {
  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b8D4C9B3A7D5e1c2F' })
  @IsEthereumAddress()
  address!: string;
}
