import React, { ReactElement } from 'react'
import type { AppProps } from 'next/app'
import Web3Provider from '@context/Web3'
import { UserPreferencesProvider } from '@context/UserPreferences'
import UrqlProvider from '@context/UrqlProvider'
import ConsentProvider from '@context/CookieConsent'
import MarketMetadataProvider from '@context/MarketMetadata'
import { SearchBarStatusProvider } from '@context/SearchBarStatus'
import App from '../../src/components/App'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../stylesGlobal/styles.css'
import Decimal from 'decimal.js'
import store from '../store'
import { Provider, useDispatch } from 'react-redux'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  Decimal.set({ rounding: 1 })

  const MyAppWithDispatch = () => {
    return (
      <MarketMetadataProvider>
        <Web3Provider>
          <UrqlProvider>
            <UserPreferencesProvider>
              <ConsentProvider>
                <SearchBarStatusProvider>
                  <Provider store={store}>
                    <App>
                      <Component {...pageProps} />
                    </App>
                  </Provider>
                </SearchBarStatusProvider>
              </ConsentProvider>
            </UserPreferencesProvider>
          </UrqlProvider>
        </Web3Provider>
      </MarketMetadataProvider>
    )
  }

  return <MyAppWithDispatch />
}

export default MyApp
