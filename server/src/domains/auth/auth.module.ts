import { Module } from '@nestjs/common';
import PrismaAUthRepositorie from './repo/repos/PrismaAuthRepositorie';
import AuthService from './auth.service';
import AuthController from './auth.controller';

@Module({
  exports: [PrismaAUthRepositorie, AuthService],
  providers: [PrismaAUthRepositorie, AuthService],
  controllers: [AuthController],
})
export default class AuthModule {}
