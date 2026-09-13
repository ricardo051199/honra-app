import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ShipOrderDto {
  @ApiProperty({ example: 'DHL' })
  @IsString()
  carrier!: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  trackingNumber!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  trackingUrl?: string;
}
