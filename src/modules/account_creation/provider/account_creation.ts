import { Injectable } from '@nestjs/common';
import { Wallet } from '@stellar/typescript-wallet-sdk';
import {
  AnchorDomains,
  AnchorProviderInterface,
  StellarNetworkType,
} from '../interface/account_creation.interface';

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

  provideStellarServer(network: StellarNetworkType) {
    const wallet = this.provideWallet(network);
    return wallet.stellar();
  }

  provideAnchorDomain(domain?: string) {
    const anchorDomain = domain ? domain : AnchorDomains.DEFAULT;
    return anchorDomain;
  }

  provideAnchor(args: AnchorProviderInterface) {
    const { network, domain } = args;
    const wallet = this.provideWallet(network);
    const anchorDomain = this.provideAnchorDomain(domain);

    return wallet.anchor({ homeDomain: anchorDomain });
  }
}
