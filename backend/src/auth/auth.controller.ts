import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { NonceRequestDto } from './dto/nonce.dto.js';
import { VerifyDto } from './dto/verify.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { AuthTokenPayload } from './auth.service.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  @HttpCode(200)
  requestNonce(@Body() dto: NonceRequestDto) {
    const { nonce, message } = this.authService.requestNonce(dto.address);
    return { nonce, message };
  }

  @Post('verify')
  @HttpCode(200)
  async verify(@Body() dto: VerifyDto) {
    return this.authService.verifyAndIssueToken(dto.address, dto.signature);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  logout() {
    // Stateless JWT: logout is handled client-side by discarding the token.
    // If you need server-side revocation, maintain a denylist in Redis.
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@CurrentUser() user: AuthTokenPayload) {
    return this.authService.me(user.sub);
  }
}
