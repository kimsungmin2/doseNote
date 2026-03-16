import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../utils/guards/jwt-refresh.guard';
import { JwtRefreshStrategy } from '../utils/strategy/jwt-refresh.strategy';
import { JwtStrategy } from '../utils/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
            10,
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    JwtRefreshGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
