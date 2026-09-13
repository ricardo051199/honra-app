import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { NonceService } from './nonce.service.js';
import { JwtStrategy } from './jwt.strategy.js';

@Module({
  imports: [
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
        const jwtSecret = config.get<string>('app.jwtSecret');

        if (!jwtSecret) {
          throw new Error('JWT secret is not configured');
        }

        const jwtExpiresIn =
          config.get<string>('app.jwtExpiresIn') ?? '7d';

        return {
          secret: jwtSecret,

          signOptions: {
            expiresIn: jwtExpiresIn as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`,
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    NonceService,
    JwtStrategy,
  ],

  exports: [AuthService],
})
export class AuthModule {}