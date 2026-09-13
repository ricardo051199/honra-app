import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MaxLength(140)
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  /** USDC amount, e.g. 320.00. Converted to 6-decimal integer at the blockchain boundary. */
  @ApiProperty({ example: 320 })
  @IsNumber({ maxDecimalPlaces: 6 })
  @IsPositive()
  priceUsdc!: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
