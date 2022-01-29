import { RouteInfo } from "@jup-ag/core";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";

export interface IToken {
  chainId: number; // 101,
  address: string; // '8f9s1sUmzUbVZMoMh6bufMueYH1u4BJSM57RCEvuVmFp',
  symbol: string; // 'TRUE',
  name: string; // 'TrueSight',
  decimals: number; // 9,
  logoURI: string; // 'https://i.ibb.co/pKTWrwP/true.jpg',
  tags: string[]; // [ 'utility-token', 'capital-token' ]
  balance: number;
}

export interface IRoutes {
  routesInfos: RouteInfo[];
  cached: boolean;
}

export interface ISplTokenInfo {
  symbol?: string;
  balance: number;
  mint: string;
}

export interface IParsedInfo {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
}
