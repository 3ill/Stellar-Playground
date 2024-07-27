import { Injectable } from '@nestjs/common';
import { Wallet } from '@stellar/typescript-wallet-sdk';
import { StellarNetworkType } from '../interface/account_creation.interface';

@Injectable()
export class AccountCreation {
  provideTestWallet() {
    return Wallet.TestNet();
  }

  provideMainWallet() {
    return Wallet.MainNet();
  }

  provideWallet(network: StellarNetworkType) {
    if (network === 'testnet') {
      return this.provideTestWallet();
    } else {
      return this.provideMainWallet();
    }
  }
}
