import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';

export const DISPUTE_REASONS = [
  'not_received',
  'not_as_described',
  'wrong_item',
  'seller_cancelled',
  'other',
] as const;

export class CreateDisputeDto {
  @ApiProperty({ enum: DISPUTE_REASONS })
  @IsIn(DISPUTE_REASONS)
  reason!: (typeof DISPUTE_REASONS)[number];

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description!: string;
}
