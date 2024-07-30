import { Module } from '@nestjs/common';
import { AuthenticationProvider } from './provider/authentication.provider';
import { AuthenticationService } from './service/authentication.service';
import { AuthenticationController } from './controller/authentication.controller';
import { AccountCreationModule } from '../account_creation/account_creation.module';

@Module({
  imports: [AccountCreationModule],
  providers: [AuthenticationService, AuthenticationProvider],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
