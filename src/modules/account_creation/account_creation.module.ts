import { Module } from '@nestjs/common';
import { AccountCreationService } from './service/account_creation.service';
import { AccountCreationProvider } from './provider/account_creation.provider';
import { AccountCreationController } from './controller/account_creation.controller';

@Module({
  providers: [AccountCreationService, AccountCreationProvider],
  controllers: [AccountCreationController],
})
export class AccountCreationModule {}
