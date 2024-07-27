import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountCreationModule } from './modules/account_creation/account_creation.module';

@Module({
  imports: [AccountCreationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
