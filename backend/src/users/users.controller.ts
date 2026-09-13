import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthTokenPayload } from '../auth/auth.service';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('users/me')
  updateMe(@CurrentUser() user: AuthTokenPayload, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.sub, dto);
  }
}
