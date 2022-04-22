import { act, render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { MemoryHistory } from 'history/createMemoryHistory'
import { QueryClient } from 'react-query'
import { Provider } from 'react-redux'

import { i18n } from '@lingui/core'

import { NetworkContext } from 'contexts/networkContext'

import { NetworkName } from 'models/network-name'

import { HashRouter } from 'react-router-dom'

import { PropsWithChildren } from 'react'

import V2UserProvider from 'providers/v2/UserProvider'

import ReactQueryProvider from '../src/providers/ReactQueryProvider'
import LanguageProvider from '../src/providers/LanguageProvider'
import ThemeProvider from '../src/providers/ThemeProvider'
import { Language } from '../src/constants/languages/language-options'

export const MOCK_TEST_UUID = '1234-56768-123-4567'

type DefaultParams = Parameters<typeof render>

type RenderOptions = DefaultParams[1] & {
  locale?: keyof Language
  cookies?: Record<string, string>
  router?: MemoryHistory
  queryClient?: QueryClient
  user?: {
    username: string
  }
  Wrapper?: React.FC<{}>
  store?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface SimplifiedRouterOptions {
  initialEntries?: string[]
  historyRoutes?: string[]
  url?: string
}

export const setupRouter = (options?: SimplifiedRouterOptions) => {
  const initialEntries: string[] = options?.initialEntries || []

  if (!options?.initialEntries) {
    if (options?.historyRoutes) {
      initialEntries.push(...options.historyRoutes)
    }

    if (options?.url) {
      initialEntries.push(options.url)
    }
  }

  return createMemoryHistory({
    initialEntries,
  })
}

const customRender = (
  component: React.ReactElement,
  {
    cookies: mockCookies,
    locale = 'en',
    queryClient,
    router = setupRouter(),
    user,
    Wrapper,
    store,
    ...options
  }: RenderOptions,
) => {
  // Lingui testing: https://lingui.js.org/guides/testing.html
  act(() => {
    i18n.activate(locale)
  })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  if (!Wrapper) {
    Wrapper = ({ children }: PropsWithChildren<{}>) => (
      <ReactQueryProvider>
        <Provider store={store}>
          <LanguageProvider>
            <ThemeProvider>
              <NetworkContext.Provider
                value={{
                  signerNetwork: NetworkName.mainnet,
                  signingProvider: undefined,
                  userAddress: undefined,
                  onSelectWallet: undefined,
                  onLogOut: undefined,
                }}
              >
                <V2UserProvider>
                  <HashRouter>{children}</HashRouter>
                </V2UserProvider>
              </NetworkContext.Provider>
            </ThemeProvider>
          </LanguageProvider>
        </Provider>
      </ReactQueryProvider>
    )
  }

  return render(component, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { customRender as render }
