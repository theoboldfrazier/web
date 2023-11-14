import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import {
  Box,
  Card,
  CardFooter,
  Circle,
  Collapse,
  Divider,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Step,
  StepDescription,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepTitle,
  useColorModeValue,
} from '@chakra-ui/react'
import { TxStatus } from '@shapeshiftoss/unchained-client'
import { useMemo } from 'react'
import { FaAdjust, FaGasPump, FaProcedures } from 'react-icons/fa'
import { Amount } from 'components/Amount/Amount'
import type { StepperStep } from 'components/MultiHopTrade/types'
import { RawText } from 'components/Text'

const cardBorderRadius = { base: 'xl' }

export const Hop = ({
  steps,
  activeStep,
  slippageDecimalPercentage,
  networkFeeFiatPrecision,
  protocolFeeFiatPrecision,
  title,
  hopIndex,
  txStatus,
  isOpen,
  onToggleIsOpen,
}: {
  steps: StepperStep[]
  activeStep: number
  slippageDecimalPercentage: string
  networkFeeFiatPrecision: string
  protocolFeeFiatPrecision: string
  title: string
  hopIndex: number
  txStatus?: TxStatus
  isOpen: boolean
  onToggleIsOpen: () => void
}) => {
  const backgroundColor = useColorModeValue('gray.100', 'gray.750')
  const borderColor = useColorModeValue('gray.50', 'gray.650')

  const timeEstimate = '4m'
  const timeRemaining = '3:35'

  const rightComponent = useMemo(() => {
    switch (txStatus) {
      case undefined:
      case TxStatus.Unknown:
        return <RawText>{timeEstimate}</RawText>
      case TxStatus.Pending:
        return <RawText>{timeRemaining}</RawText>
      case TxStatus.Confirmed:
        return (
          <Box width='auto'>
            <IconButton
              aria-label='expand'
              variant='link'
              p={4}
              borderTopRadius='none'
              colorScheme='blue'
              onClick={onToggleIsOpen}
              width='full'
              icon={isOpen ? <ChevronUpIcon boxSize='16px' /> : <ChevronDownIcon boxSize='16px' />}
            />
          </Box>
        )
      default:
        return null
    }
  }, [isOpen, onToggleIsOpen, txStatus])

  return (
    <Card
      flex={1}
      borderRadius={cardBorderRadius}
      width='full'
      backgroundColor={backgroundColor}
      borderColor={borderColor}
    >
      <HStack width='full' justifyContent='space-between' paddingLeft={6} marginTop={4}>
        <HStack>
          <Circle size={8} borderColor={borderColor} borderWidth={2}>
            <RawText as='b'>{hopIndex + 1}</RawText>
          </Circle>
          <RawText as='b'>{title}</RawText>
        </HStack>
        {rightComponent}
      </HStack>
      <Collapse in={isOpen}>
        <Stepper index={activeStep} orientation='vertical' gap='0' margin={6}>
          {steps.map(({ title, stepIndicator, description, content, key }, index) => (
            <Step key={key}>
              <StepIndicator>{stepIndicator}</StepIndicator>

              <Box flexShrink='0'>
                <StepTitle>{title}</StepTitle>
                {description && <StepDescription>{description}</StepDescription>}
                {index === activeStep && content}
                {index < steps.length - 1 && <Spacer height={6} />}
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Collapse>
      <Divider />
      <CardFooter>
        <HStack width='full' justifyContent='space-between'>
          {/* Hovering over this should render a popover with details */}
          <Flex alignItems='center'>
            <Box marginRight={2} color='text.subtle'>
              <FaGasPump />
            </Box>
            <Amount.Fiat value={networkFeeFiatPrecision} display='inline' />
          </Flex>

          {/* Hovering over this should render a popover with details */}
          <Flex alignItems='center'>
            {/* Placeholder - use correct icon here */}

            <Box marginRight={2} color='text.subtle'>
              <FaProcedures />
            </Box>
            <Amount.Fiat value={protocolFeeFiatPrecision} display='inline' />
          </Flex>

          <Flex alignItems='center'>
            {/* Placeholder - use correct icon here */}

            <Box marginRight={2} color='text.subtle'>
              <FaAdjust />
            </Box>
            <Amount.Percent value={slippageDecimalPercentage} display='inline' />
          </Flex>
        </HStack>
      </CardFooter>
    </Card>
  )
}