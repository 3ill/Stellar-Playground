import { StellarNetworkType } from '@/modules/account_creation/interface/account_creation.interface';

export interface GetAssetConfigInterface {
  network: StellarNetworkType;
  asset: string;
  domain?: string;
}

export interface TrustInterface extends GetAssetConfigInterface {
  privateKey: string;
}
