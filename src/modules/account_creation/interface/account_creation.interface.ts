export type StellarNetworkType = 'testnet' | 'mainnet';

export enum AnchorDomains {
  DEFAULT = 'testanchor.stellar.org',
}

export interface AnchorDomainInterface {
  domain?: string;
}

export interface AnchorProviderInterface extends AnchorDomainInterface {
  network: StellarNetworkType;
}
