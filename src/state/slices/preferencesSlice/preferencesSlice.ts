import { createSlice } from '@reduxjs/toolkit'
import type { HistoryTimeframe } from '@shapeshiftoss/types'
import { getConfig } from 'config'
import { DEFAULT_HISTORY_TIMEFRAME } from 'constants/Config'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { simpleLocale } from 'lib/browserLocale'
import type { SupportedFiatCurrencies } from 'lib/market-service'

dayjs.extend(localizedFormat)

export type FeatureFlags = {
  Optimism: boolean
  BnbSmartChain: boolean
  Polygon: boolean
  Gnosis: boolean
  Arbitrum: boolean
  ArbitrumNova: boolean
  ThorSwap: boolean
  ThorSwapStreamingSwaps: boolean
  Yat: boolean
  WalletConnectToDapps: boolean
  WalletConnectToDappsV2: boolean
  Wherever: boolean
  SaversVaults: boolean
  SaversVaultsDeposit: boolean
  SaversVaultsWithdraw: boolean
  Yearn: boolean
  DefiDashboard: boolean
  ArkeoAirdrop: boolean
  TradeRates: boolean
  Cowswap: boolean
  CowswapGnosis: boolean
  ZrxSwap: boolean
  Mixpanel: boolean
  LifiSwap: boolean
  FoxBondCTA: boolean
  DynamicLpAssets: boolean
  ReadOnlyAssets: boolean
  Jaypegz: boolean
  OneInch: boolean
  CovalentJaypegs: boolean
  Chatwoot: boolean
  CoinbaseWallet: boolean
  AdvancedSlippage: boolean
  WalletConnectV2: boolean
  CustomSendNonce: boolean
  Snaps: boolean
  ThorchainLending: boolean
  ThorchainLendingBorrow: boolean
  ThorchainLendingRepay: boolean
  ThorchainLP: boolean
  ThorchainLpDeposit: boolean
  ThorchainLpWithdraw: boolean
  LedgerWallet: boolean
  ThorchainSwapLongtail: boolean
  ShapeShiftMobileWallet: boolean
}

export type Flag = keyof FeatureFlags

export enum CurrencyFormats {
  DotDecimalCommaThousands = 'en-US', // $123,456.78 (examples for a user using USD)
  DotDecimalCommaThousandsLakhCrore = 'en-IN', // $1,23,456.78
  DotDecimalQuoteThousands = 'de-CH', // $ 123’456.78
  CommaDecimalSpaceThousands = 'fr-FR', // 123 456,78 $US
  CommaDecimalDotThousands = 'de-DE', // 123.456,78 $
}

export type Preferences = {
  featureFlags: FeatureFlags
  selectedLocale: string
  balanceThreshold: string
  selectedCurrency: SupportedFiatCurrencies
  currencyFormat: CurrencyFormats
  chartTimeframe: HistoryTimeframe
  showWelcomeModal: boolean
  showConsentBanner: boolean
  showSnapsModal: boolean
  snapInstalled: boolean
}

const initialState: Preferences = {
  featureFlags: {
    Jaypegz: getConfig().REACT_APP_FEATURE_JAYPEGZ,
    Optimism: getConfig().REACT_APP_FEATURE_OPTIMISM,
    BnbSmartChain: getConfig().REACT_APP_FEATURE_BNBSMARTCHAIN,
    Polygon: getConfig().REACT_APP_FEATURE_POLYGON,
    Gnosis: getConfig().REACT_APP_FEATURE_GNOSIS,
    Arbitrum: getConfig().REACT_APP_FEATURE_ARBITRUM,
    ArbitrumNova: getConfig().REACT_APP_FEATURE_ARBITRUM_NOVA,
    ThorSwap: getConfig().REACT_APP_FEATURE_THOR_SWAP,
    ThorSwapStreamingSwaps: getConfig().REACT_APP_FEATURE_THOR_SWAP_STREAMING_SWAPS,
    Yat: getConfig().REACT_APP_FEATURE_YAT,
    WalletConnectToDappsV2: getConfig().REACT_APP_FEATURE_WALLET_CONNECT_TO_DAPPS_V2,
    WalletConnectToDapps: getConfig().REACT_APP_FEATURE_WALLET_CONNECT_TO_DAPPS,
    Wherever: getConfig().REACT_APP_FEATURE_WHEREVER,
    SaversVaults: getConfig().REACT_APP_FEATURE_SAVERS_VAULTS,
    SaversVaultsDeposit: getConfig().REACT_APP_FEATURE_SAVERS_VAULTS_DEPOSIT,
    SaversVaultsWithdraw: getConfig().REACT_APP_FEATURE_SAVERS_VAULTS_WITHDRAW,
    Yearn: getConfig().REACT_APP_FEATURE_YEARN,
    DefiDashboard: getConfig().REACT_APP_FEATURE_DEFI_DASHBOARD,
    ArkeoAirdrop: getConfig().REACT_APP_FEATURE_ARKEO_AIRDROP,
    TradeRates: getConfig().REACT_APP_FEATURE_TRADE_RATES,
    Cowswap: getConfig().REACT_APP_FEATURE_COWSWAP,
    CowswapGnosis: getConfig().REACT_APP_FEATURE_COWSWAP_GNOSIS,
    ZrxSwap: getConfig().REACT_APP_FEATURE_ZRX_SWAP,
    LifiSwap: getConfig().REACT_APP_FEATURE_LIFI_SWAP,
    CovalentJaypegs: getConfig().REACT_APP_FEATURE_COVALENT_JAYPEGS,
    Mixpanel: getConfig().REACT_APP_FEATURE_MIXPANEL,
    FoxBondCTA: getConfig().REACT_APP_FEATURE_FOX_BOND_CTA,
    DynamicLpAssets: getConfig().REACT_APP_FEATURE_DYNAMIC_LP_ASSETS,
    ReadOnlyAssets: getConfig().REACT_APP_FEATURE_READ_ONLY_ASSETS,
    OneInch: getConfig().REACT_APP_FEATURE_ONE_INCH,
    Chatwoot: getConfig().REACT_APP_FEATURE_CHATWOOT,
    CoinbaseWallet: getConfig().REACT_APP_FEATURE_COINBASE_WALLET,
    AdvancedSlippage: getConfig().REACT_APP_FEATURE_ADVANCED_SLIPPAGE,
    WalletConnectV2: getConfig().REACT_APP_FEATURE_WALLET_CONNECT_V2,
    CustomSendNonce: getConfig().REACT_APP_EXPERIMENTAL_CUSTOM_SEND_NONCE,
    Snaps: getConfig().REACT_APP_EXPERIMENTAL_MM_SNAPPY_FINGERS,
    ThorchainLending: getConfig().REACT_APP_FEATURE_THORCHAIN_LENDING,
    ThorchainLendingBorrow: getConfig().REACT_APP_FEATURE_THORCHAIN_LENDING_BORROW,
    ThorchainLendingRepay: getConfig().REACT_APP_FEATURE_THORCHAIN_LENDING_REPAY,
    ThorchainLP: getConfig().REACT_APP_FEATURE_THORCHAIN_LP,
    ThorchainLpDeposit: getConfig().REACT_APP_FEATURE_THORCHAIN_LP_DEPOSIT,
    ThorchainLpWithdraw: getConfig().REACT_APP_FEATURE_THORCHAIN_LP_WITHDRAW,
    LedgerWallet: getConfig().REACT_APP_FEATURE_LEDGER_WALLET,
    ThorchainSwapLongtail: getConfig().REACT_APP_FEATURE_THORCHAINSWAP_LONGTAIL,
    ShapeShiftMobileWallet: getConfig().REACT_APP_FEATURE_SHAPESHIFT_MOBILE_WALLET,
  },
  selectedLocale: simpleLocale(),
  balanceThreshold: '0',
  selectedCurrency: 'USD',
  currencyFormat: CurrencyFormats.DotDecimalCommaThousands,
  chartTimeframe: DEFAULT_HISTORY_TIMEFRAME,
  showWelcomeModal: false,
  showConsentBanner: true,
  showSnapsModal: true,
  snapInstalled: false,
}

export const preferences = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    clearFeatureFlags: state => {
      state.featureFlags = initialState.featureFlags
    },
    setFeatureFlag(state, { payload }: { payload: { flag: keyof FeatureFlags; value: boolean } }) {
      state.featureFlags[payload.flag] = payload.value
    },
    setSelectedLocale(state, { payload }: { payload: { locale: string } }) {
      state.selectedLocale = payload.locale
    },
    setSelectedCurrency(state, { payload }: { payload: { currency: SupportedFiatCurrencies } }) {
      state.selectedCurrency = payload.currency
    },
    setBalanceThreshold(state, { payload }: { payload: { threshold: string } }) {
      state.balanceThreshold = payload.threshold
    },
    setCurrencyFormat(state, { payload }: { payload: { currencyFormat: CurrencyFormats } }) {
      state.currencyFormat = payload.currencyFormat
    },
    setChartTimeframe(state, { payload }: { payload: { timeframe: HistoryTimeframe } }) {
      state.chartTimeframe = payload.timeframe
    },
    setWelcomeModal(state, { payload }: { payload: { show: boolean } }) {
      state.showWelcomeModal = payload.show
    },
    setShowConsentBanner(state, { payload }: { payload: boolean }) {
      state.showConsentBanner = payload
    },
    setShowSnapsModal(state, { payload }: { payload: boolean }) {
      state.showSnapsModal = payload
    },
    setSnapInstalled(state, { payload }: { payload: boolean }) {
      state.snapInstalled = payload
    },
  },
})
