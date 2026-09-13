import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString, Matches } from 'class-validator';

export class VerifyDto {
  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b8D4C9B3A7D5e1c2F' })
  @IsEthereumAddress()
  address!: string;

  @ApiProperty({ example: '0x...' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]+$/, { message: 'signature must be a 0x-prefixed hex string' })
  signature!: string;
}
