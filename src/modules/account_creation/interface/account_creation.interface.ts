import { AccountKeypair } from '@stellar/typescript-wallet-sdk';

export type StellarNetworkType = 'testnet' | 'mainnet';

export enum AnchorDomains {
  DEFAULT = 'testanchor.stellar.org',
}

export enum HorizonNetwork {
  TESTNET = 'https://horizon-testnet.stellar.org',
  MAINNET = 'https://horizon.stellar.org',
}

export interface AnchorDomainInterface {
  domain?: string;
}

export interface AnchorProviderInterface extends AnchorDomainInterface {
  network: StellarNetworkType;
}

export interface AccountBalanceInterface {
  network: StellarNetworkType;
  publicKey: string;
}

export interface AccountCreationInterface {
  network: StellarNetworkType;
  payerPrivateKey: string;
}

export interface InitTransactionInterface {
  network: StellarNetworkType;
  keyPair: AccountKeypair;
}
