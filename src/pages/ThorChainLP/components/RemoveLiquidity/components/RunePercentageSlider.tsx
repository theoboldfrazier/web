import {
  Button,
  ButtonGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from '@chakra-ui/react'
import type { Asset } from '@shapeshiftoss/types'
import { useCallback } from 'react'
import { Amount } from 'components/Amount/Amount'
import { AssetIcon } from 'components/AssetIcon'

type RunePercentSliderProps = {
  poolAsset: Asset
  runeAsset: Asset
  runeRemovalPercentage: number
  handleRuneRemovalPercentageChange: (percentage: number) => void
  handleRuneRemovalPercentageChangeEnd: (percentage: number) => void
}

const RunePercentageSlider: React.FC<RunePercentSliderProps> = ({
  poolAsset,
  runeAsset,
  runeRemovalPercentage,
  handleRuneRemovalPercentageChange,
  handleRuneRemovalPercentageChangeEnd,
}) => {
  const handlePercentageClick = useCallback(
    (percentage: number) => {
      return () => {
        handleRuneRemovalPercentageChange(percentage)
        handleRuneRemovalPercentageChangeEnd(percentage)
      }
    },
    [handleRuneRemovalPercentageChange, handleRuneRemovalPercentageChangeEnd],
  )
  if (!poolAsset || !runeAsset) return null

  return (
    <Stack px={6} py={4} fontSize='sm' flexDirection='row'>
      <Stack flexDirection='column' align='center'>
        <Stack flexDirection='row'>
          <AssetIcon assetId={poolAsset.assetId} size='xs' />
          <span>{poolAsset.symbol}</span>
        </Stack>
        <Amount.Percent value={1 - runeRemovalPercentage / 100} fontSize='xs' />
      </Stack>
      <Stack flexDirection='column' px={2}>
        <Slider
          value={runeRemovalPercentage}
          onChange={handleRuneRemovalPercentageChange}
          onChangeEnd={handleRuneRemovalPercentageChangeEnd}
        >
          <SliderTrack>
            <SliderFilledTrack bg='blue.500' />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <ButtonGroup size='xs' justifyContent='space-between'>
          <Button onClick={handlePercentageClick(0)} flex={1}>
            100%
          </Button>
          <Button onClick={handlePercentageClick(25)} flex={1}>
            75%
          </Button>
          <Button onClick={handlePercentageClick(50)} flex={1}>
            50%
          </Button>
          <Button onClick={handlePercentageClick(75)} flex={1}>
            75%
          </Button>
          <Button onClick={handlePercentageClick(100)} flex={1}>
            100%
          </Button>
        </ButtonGroup>
      </Stack>
      <Stack flexDirection='column' align='center'>
        <Stack flexDirection='row'>
          <AssetIcon assetId={runeAsset.assetId} size='xs' />
          <span>{runeAsset.symbol}</span>
        </Stack>
        <Amount.Percent value={runeRemovalPercentage / 100} fontSize='xs' />
      </Stack>
    </Stack>
  )
}

export { RunePercentageSlider }
