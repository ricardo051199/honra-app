import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthTokenPayload } from '../auth/auth.service';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@ApiTags('disputes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get('disputes')
  list(@CurrentUser() user: AuthTokenPayload) {
    return this.disputesService.listForUser(user.sub, user.role);
  }

  @Get('disputes/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload) {
    return this.disputesService.findById(id, user.sub, user.role);
  }

  @Post('orders/:id/dispute')
  open(@Param('id') orderId: string, @CurrentUser() user: AuthTokenPayload, @Body() dto: CreateDisputeDto) {
    return this.disputesService.open(orderId, user.sub, dto);
  }

  @Post('disputes/:id/review')
  @UseGuards(RolesGuard)
  @Roles('admin')
  review(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload) {
    return this.disputesService.review(id, user.sub);
  }

  @Post('disputes/:id/resolve/refund')
  @UseGuards(RolesGuard)
  @Roles('admin')
  resolveRefund(
    @Param('id') id: string,
    @CurrentUser() user: AuthTokenPayload,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.disputesService.resolveRefund(id, user.sub, dto);
  }

  @Post('disputes/:id/resolve/release')
  @UseGuards(RolesGuard)
  @Roles('admin')
  resolveRelease(
    @Param('id') id: string,
    @CurrentUser() user: AuthTokenPayload,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.disputesService.resolveRelease(id, user.sub, dto);
  }
}
