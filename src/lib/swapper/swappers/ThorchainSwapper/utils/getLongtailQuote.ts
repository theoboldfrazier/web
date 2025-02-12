import { ethChainId } from '@shapeshiftoss/caip'
import type { EvmChainId } from '@shapeshiftoss/chain-adapters'
import type { GetTradeQuoteInput, MultiHopTradeQuoteSteps } from '@shapeshiftoss/swapper'
import { makeSwapErrorRight, type SwapErrorRight, TradeQuoteError } from '@shapeshiftoss/swapper'
import type { AssetsByIdPartial } from '@shapeshiftoss/types'
import type { Result } from '@sniptt/monads'
import { Err, Ok } from '@sniptt/monads'
import type { FeeAmount } from '@uniswap/v3-sdk'
import assert from 'assert'
import type { GetContractReturnType, PublicClient, WalletClient } from 'viem'
import { type Address, getContract } from 'viem'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { viemClientByChainId } from 'lib/viem-client'

import { QuoterAbi } from '../getThorTradeQuote/abis/QuoterAbi'
import type { ThorTradeQuote } from '../getThorTradeQuote/getTradeQuote'
import { getL1quote } from './getL1quote'
import {
  feeAmountToContractMap,
  generateV3PoolAddressesAcrossFeeRange,
  getContractDataByPool,
  getQuotedAmountOutByPool,
  getTokenFromAsset,
  getWrappedToken,
  selectBestRate,
  TradeType,
} from './longTailHelpers'

// This just gets uses UniswapV3 to get the longtail quote for now.
export const getLongtailToL1Quote = async (
  input: GetTradeQuoteInput,
  streamingInterval: number,
  assetsById: AssetsByIdPartial,
): Promise<Result<ThorTradeQuote[], SwapErrorRight>> => {
  const { sellAsset, sellAmountIncludingProtocolFeesCryptoBaseUnit } = input

  /*
    We only support ethereum longtail -> L1 swaps for now.
    We can later add BSC via UniV3, or Avalanche (e.g. via PancakeSwap)
  */
  if (sellAsset.chainId !== ethChainId) {
    return Err(
      makeSwapErrorRight({
        message: `[getThorTradeQuote] - Unsupported chainId ${sellAsset.chainId}.`,
        code: TradeQuoteError.UnsupportedChain,
        details: { sellAssetChainId: sellAsset.chainId },
      }),
    )
  }

  const chainAdapterManager = getChainAdapterManager()
  const sellChainId = sellAsset.chainId
  const nativeBuyAssetId = chainAdapterManager.get(sellChainId)?.getFeeAssetId()
  const nativeBuyAsset = nativeBuyAssetId ? assetsById[nativeBuyAssetId] : undefined
  if (!nativeBuyAsset) {
    return Err(
      makeSwapErrorRight({
        message: `[getThorTradeQuote] - No native buy asset found for ${sellChainId}.`,
        code: TradeQuoteError.InternalError,
        details: { sellAssetChainId: sellChainId },
      }),
    )
  }

  // TODO: use more than just UniswapV3, and also consider trianglar routes.
  const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984' // FIXME: this is only true for Ethereum
  const ALLOWANCE_CONTRACT = '0xF892Fef9dA200d9E84c9b0647ecFF0F34633aBe8' // TSAggregatorTokenTransferProxy

  const tokenA = getTokenFromAsset(sellAsset)
  const tokenB = getWrappedToken(nativeBuyAsset)

  const publicClient = viemClientByChainId[sellChainId as EvmChainId]
  assert(publicClient !== undefined, `no public client found for chainId '${sellChainId}'`)

  const poolAddresses: Map<
    Address,
    { token0Address: Address; token1Address: Address; fee: FeeAmount }
  > = generateV3PoolAddressesAcrossFeeRange(POOL_FACTORY_CONTRACT_ADDRESS, tokenA, tokenB)

  const poolContractData = getContractDataByPool(
    poolAddresses,
    publicClient,
    tokenA.address,
    tokenB.address,
  )

  const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6' // FIXME: this is only true for Ethereum
  const quoterContract: GetContractReturnType<typeof QuoterAbi, PublicClient, WalletClient> =
    getContract({
      abi: QuoterAbi,
      address: QUOTER_CONTRACT_ADDRESS,
      publicClient,
    })

  const quotedAmountOutByPool = await getQuotedAmountOutByPool(
    poolContractData,
    BigInt(sellAmountIncludingProtocolFeesCryptoBaseUnit),
    quoterContract,
  )

  const [bestPool, quotedAmountOut] = selectBestRate(quotedAmountOutByPool) ?? [
    undefined,
    undefined,
  ]

  const bestContractData = bestPool ? poolContractData.get(bestPool) : undefined
  const bestAggregator = bestContractData ? feeAmountToContractMap[bestContractData.fee] : undefined

  if (!bestAggregator || !quotedAmountOut) {
    return Err(
      makeSwapErrorRight({
        message: `[getThorTradeQuote] - No best aggregator contract found.`,
        code: TradeQuoteError.UnsupportedTradePair,
      }),
    )
  }

  const l1Tol1QuoteInput: GetTradeQuoteInput = {
    ...input,
    sellAsset: nativeBuyAsset,
    sellAmountIncludingProtocolFeesCryptoBaseUnit: quotedAmountOut.toString(),
  }

  const thorchainQuotes = await getL1quote(
    l1Tol1QuoteInput,
    streamingInterval,
    TradeType.LongTailToL1,
  )

  return thorchainQuotes.andThen(quotes => {
    const updatedQuotes: ThorTradeQuote[] = quotes.map(q => ({
      ...q,
      aggregator: bestAggregator,
      // This logic will need to be updated to support multi-hop, if that's ever implemented for THORChain
      steps: q.steps.map(s => ({
        ...s,
        sellAmountIncludingProtocolFeesCryptoBaseUnit,
        sellAsset,
        allowanceContract: ALLOWANCE_CONTRACT,
      })) as MultiHopTradeQuoteSteps, // assuming multi-hop quote steps here since we're mapping over quote steps
      isLongtail: true,
      longtailData: {
        longtailToL1ExpectedAmountOut: quotedAmountOut,
      },
    }))

    return Ok(updatedQuotes)
  })
}
