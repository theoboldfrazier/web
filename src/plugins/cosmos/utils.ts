import { fromAssetId } from '@shapeshiftoss/caip'
import type {
  cosmossdk,
  CosmosSdkChainId,
  FeeDataKey,
  GetFeeDataInput,
} from '@shapeshiftoss/chain-adapters'
import type { Asset } from '@shapeshiftoss/types'
import { bnOrZero } from 'lib/bignumber/bignumber'
import { assertGetCosmosSdkChainAdapter } from 'lib/utils/cosmosSdk'

export type FeePriceValueHuman = {
  fiatFee: string
  txFee: string
  chainSpecific: cosmossdk.FeeData
}
export type FeePrice = {
  [key in FeeDataKey]: FeePriceValueHuman
}

export const getFormFees = async (asset: Asset, userCurrencyRate: string) => {
  // We don't use all of these fields for the return value but this is our standard FeeDataEstimate fees, for consistency
  const initialFees = {
    slow: {
      fiatFee: '',
      txFee: '',
      chainSpecific: {
        gasLimit: '',
      },
    },
    average: {
      fiatFee: '',
      txFee: '',
      chainSpecific: {
        gasLimit: '',
      },
    },
    fast: {
      fiatFee: '',
      txFee: '',
      chainSpecific: {
        gasLimit: '',
      },
    },
  }

  const adapter = assertGetCosmosSdkChainAdapter(fromAssetId(asset.assetId).chainId)

  const getFeeDataInput: Partial<GetFeeDataInput<CosmosSdkChainId>> = {}
  const feeData = await adapter.getFeeData(getFeeDataInput)

  if (!adapter)
    return {
      gasLimit: initialFees.average.chainSpecific.gasLimit,
      gasPrice: initialFees.average.txFee,
    }

  const adapterFees = (Object.keys(feeData) as FeeDataKey[]).reduce<FeePrice>(
    (acc: any, key: FeeDataKey) => {
      const chainSpecific = feeData[key].chainSpecific
      const txFee = bnOrZero(feeData[key].txFee)
        .dividedBy(bnOrZero(`1e+${asset.precision}`))
        .toPrecision()
      const fiatFee = bnOrZero(txFee).times(userCurrencyRate).toPrecision()
      acc[key] = { txFee, fiatFee, chainSpecific }
      return acc
    },
    initialFees,
  )

  return {
    gasLimit: adapterFees.average.chainSpecific.gasLimit,
    gasPrice: adapterFees.average.txFee,
  }
}
