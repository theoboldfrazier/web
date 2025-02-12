import type { HDWallet } from '@shapeshiftoss/hdwallet-core'
import type { GetTradeQuoteInput } from '@shapeshiftoss/swapper'
import type { AccountMetadata, Asset } from '@shapeshiftoss/types'

export enum TradeRoutePaths {
  Input = '/trade/input',
  Confirm = '/trade/confirm',
  Quotes = '/trade/quotes',
  VerifyAddresses = '/trade/verify-addresses',
}

export type GetReceiveAddressArgs = {
  asset: Asset
  wallet: HDWallet
  deviceId: string
  accountMetadata: AccountMetadata
  pubKey?: string
}

export type TradeQuoteInputCommonArgs = Pick<
  GetTradeQuoteInput,
  | 'sellAmountIncludingProtocolFeesCryptoBaseUnit'
  | 'sellAsset'
  | 'buyAsset'
  | 'receiveAddress'
  | 'accountNumber'
  | 'affiliateBps'
  | 'potentialAffiliateBps'
  | 'allowMultiHop'
  | 'slippageTolerancePercentageDecimal'
>
