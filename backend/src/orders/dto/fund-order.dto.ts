import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

const TX_HASH_PATTERN = /^0x[a-fA-F0-9]{64}$/;

export class FundOrderDto {
  @ApiProperty({ example: '0x...' })
  @IsString()
  @Matches(TX_HASH_PATTERN, { message: 'approvalTxHash must be a valid tx hash' })
  approvalTxHash!: string;

  @ApiProperty({ example: '0x...' })
  @IsString()
  @Matches(TX_HASH_PATTERN, { message: 'fundTxHash must be a valid tx hash' })
  fundTxHash!: string;
}
