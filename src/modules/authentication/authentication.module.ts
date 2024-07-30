import { Module } from '@nestjs/common';
import { AuthenticationProvider } from './provider/authentication.provider';
import { AuthenticationService } from './service/authentication.service';

@Module({
  providers: [AuthenticationService, AuthenticationProvider],
})
export class AuthenticationModule {}
