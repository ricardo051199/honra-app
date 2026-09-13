import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResolveDisputeDto {
  @ApiPropertyOptional({ description: 'Admin notes on how/why this was resolved.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
