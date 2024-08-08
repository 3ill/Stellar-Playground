import { StellarNetworkType } from '@/modules/account_creation/interface/account_creation.interface';
import { AccountCreationProvider } from '@/modules/account_creation/provider/account_creation.provider';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GetAssetConfigInterface } from '../interface/payments.interface';
import {
  AccountKeypair,
  Keypair,
  SigningKeypair,
} from '@stellar/typescript-wallet-sdk';

@Injectable()
export class PaymentsProvider {
  constructor(
    private readonly accountCreationProvider: AccountCreationProvider,
  ) {}

  async listAnchorCurrencies(network: StellarNetworkType, domain?: string) {
    const anchor = this.accountCreationProvider.provideAnchor({
      network,
      domain,
    });

    const currencies = (await anchor.getInfo()).currencies;

    return currencies;
  }

  async getAssetConfig(args: GetAssetConfigInterface) {
    const { network, domain, asset } = args;
    const listedCurrencies = await this.listAnchorCurrencies(network, domain);
    const currency = listedCurrencies.find((c) => c.code === asset);

    if (!currency.code || !currency.issuer) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Anchor does not support this asset',
      };
    }
    const assetConfig = {
      code: currency.code,
      issuer: currency.issuer,
    };

    return assetConfig;
  }

  async returnTxBuilder(network: StellarNetworkType, privateKey: string) {
    const sourceAccount = new AccountKeypair(Keypair.fromSecret(privateKey));
    const txBuilder = await this.accountCreationProvider.initializeTransaction({
      network,
      keyPair: sourceAccount,
    });

    return txBuilder;
  }

  async returnStellarServer(network: StellarNetworkType) {
    const stellar = this.accountCreationProvider.provideStellarServer(network);
    return stellar;
  }

  deriveKeypair(privateKey: string) {
    const keyPair = Keypair.fromSecret(privateKey);
    return new AccountKeypair(keyPair);
  }

  async accountConfig(network: StellarNetworkType, privateKey: string) {
    const stellar = this.accountCreationProvider.provideStellarServer(network);
    const server = stellar.server;
    const payerKeyPair = this.deriveKeypair(privateKey);
    const sourceAccount = await server.loadAccount(payerKeyPair.publicKey);

    return {
      server,
      payerKeyPair,
      sourceAccount,
    };
  }

  returnKeyPairConfig(privateKey: string) {
    const keyPair = Keypair.fromSecret(privateKey);
    const AccountKeyPair = new AccountKeypair(keyPair);
    const signer = new SigningKeypair(keyPair);

    return {
      keyPair,
      AccountKeyPair,
      signer,
    };
  }
}
