import { Module } from '@nestjs/common';
import { AuthenticationProvider } from './provider/authentication.provider';
import { AuthenticationService } from './service/authentication.service';
import { AuthenticationController } from './controller/authentication.controller';

@Module({
  providers: [AuthenticationService, AuthenticationProvider],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
