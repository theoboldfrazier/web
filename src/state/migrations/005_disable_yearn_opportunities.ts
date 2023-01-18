import type { ReduxState } from 'state/reducer'

import { initialState } from '../slices/opportunitiesSlice/opportunitiesSlice'

export const disableYearnOpportunities = (state: ReduxState): ReduxState => {
  // Migration to clear opportunitiesApi and opportunitiesApi state
  return {
    ...state,
    opportunities: initialState,
  }
}