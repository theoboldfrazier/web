import type { AssetId } from '@shapeshiftoss/caip'
import type { MarketData } from '@shapeshiftoss/types'
import { TradeType, TransferType } from '@shapeshiftoss/unchained-client'
import { mockAssetState } from 'test/mocks/assets'
import { createMockEthTxs, EthReceive, EthSend, TradeTx } from 'test/mocks/txs'
import { describe, expect, it } from 'vitest'
import { getTransfers, getTxType } from 'hooks/useTxDetails/useTxDetails'

const [deposit] = createMockEthTxs('foo')
const marketData = {} as Record<AssetId, MarketData | undefined>

describe('useTxDetails', () => {
  it('should get correct type for standard send', () => {
    const transfers = getTransfers(EthSend, mockAssetState().byId, marketData)
    const type = getTxType(EthSend, transfers)
    expect(type).toEqual(TransferType.Send)
  })

  it('should get correct type for a standard receive', () => {
    const transfers = getTransfers(EthReceive, mockAssetState().byId, marketData)
    const type = getTxType(EthReceive, transfers)
    expect(type).toEqual(TransferType.Receive)
  })

  it('should get correct type for a trade', () => {
    const transfers = getTransfers(TradeTx, mockAssetState().byId, marketData)
    const type = getTxType(TradeTx, transfers)
    expect(type).toEqual(TradeType.Trade)
  })

  it('should get correct type for a supported method', () => {
    const transfers = getTransfers(deposit, mockAssetState().byId, marketData)
    const type = getTxType(deposit, transfers)
    expect(type).toEqual('method')
  })

  it('should get correct type for a common tx', () => {
    const common = deposit
    common.data!.method = 'common'
    const transfers = getTransfers(common, mockAssetState().byId, marketData)
    const type = getTxType(common, transfers)
    expect(type).toEqual('common')
  })
})
