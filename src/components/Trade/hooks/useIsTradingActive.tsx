import { useEffect, useState } from 'react'
import { getIsTradingActiveApi } from 'state/apis/swapper/getIsTradingActiveApi'
import { useAppDispatch } from 'state/store'
import { useSwapperStore } from 'state/zustand/swapperStore/useSwapperStore'

export const useIsTradingActive = () => {
  const [isTradingActiveOnSellPool, setIsTradingActiveOnSellPool] = useState(false)
  const [isTradingActiveOnBuyPool, setIsTradingActiveOnBuyPool] = useState(false)

  const dispatch = useAppDispatch()

  const buyAsset = useSwapperStore(state => state.buyAsset)
  const sellAsset = useSwapperStore(state => state.sellAsset)
  const sellAssetId = sellAsset?.assetId
  const buyAssetId = buyAsset?.assetId

  const { getIsTradingActive } = getIsTradingActiveApi.endpoints
  const activeSwapper = useSwapperStore(state => state.activeSwapperWithMetadata?.swapper)

  useEffect(() => {
    ;(async () => {
      const isTradingActiveOnSellPoolResult =
        sellAssetId &&
        activeSwapper &&
        (
          await dispatch(
            getIsTradingActive.initiate({
              assetId: sellAssetId,
              swapperName: activeSwapper.name,
            }),
          )
        ).data

      const isTradingActiveOnBuyPoolResult =
        buyAssetId &&
        activeSwapper &&
        (
          await dispatch(
            getIsTradingActive.initiate({
              assetId: buyAssetId,
              swapperName: activeSwapper.name,
            }),
          )
        ).data

      setIsTradingActiveOnSellPool(!!isTradingActiveOnSellPoolResult)
      setIsTradingActiveOnBuyPool(!!isTradingActiveOnBuyPoolResult)
    })()
  }, [activeSwapper, buyAssetId, dispatch, getIsTradingActive, sellAssetId])

  return { isTradingActiveOnSellPool, isTradingActiveOnBuyPool }
}
