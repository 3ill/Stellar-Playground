import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Wallet } from '@stellar/typescript-wallet-sdk';
import {
  AnchorDomains,
  AnchorProviderInterface,
  HorizonNetwork,
  InitTransactionInterface,
  StellarNetworkType,
} from '../interface/account_creation.interface';
import axios from 'axios';
import { FRIENDBOT_URL } from '@/shared/constants/constants';
import { BASE_FEE, Memo, Networks, TransactionBuilder } from 'stellar-sdk';

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

  provideHorizonDomain(network: StellarNetworkType) {
    const horizonDomain =
      network === 'testnet' ? HorizonNetwork.TESTNET : HorizonNetwork.MAINNET;
    return horizonDomain;
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

  provideAccount(network: StellarNetworkType) {
    return this.provideStellarServer(network).account();
  }

  async faucet(publicKey: string) {
    try {
      const response = await axios.get(FRIENDBOT_URL, {
        params: {
          addr: publicKey,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Faucet request sent',
        data: response.data,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async initializeTransaction(args: InitTransactionInterface) {
    const { network, keyPair } = args;
    const sourceAccount = await this.provideStellarServer(
      network,
    ).server.loadAccount(keyPair.publicKey);
    const builderNetwork =
      network === 'testnet' ? Networks.TESTNET : Networks.PUBLIC;
    return new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: builderNetwork,
      memo: new Memo('text', 'Initialization Transaction'),
    });
  }
}
