import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { act } from 'react-dom/test-utils'

import { render as rtlRender } from '../../../../../../../test/test-utils'
import FundingForm from '..'
import editingV2ProjectReducer from '../../../../../../redux/slices/editingV2Project'
import editingProjectReducer from '../../../../../../redux/slices/editingProject'

function render(component: React.ReactElement) {
  const rootReducer = combineReducers({
    editingProject: editingProjectReducer,
    editingV2Project: editingV2ProjectReducer,
  })
  const store = configureStore({
    reducer: rootReducer,
  })

  return rtlRender(component, { store })
}

describe('FundingForm', () => {
  test('renders', async () => {
    act(() => {
      const { getByText } = render(<FundingForm onFinish={() => {}} />)

      expect(getByText('Funding cycles')).toBeInTheDocument()
    })
  })
})
