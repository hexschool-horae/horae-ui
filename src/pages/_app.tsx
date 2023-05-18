import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import '@/styles/tailwind.css'
import '@/styles/app.scss'

import store from '@/app/store'
import RouterGuard from '@/app/RouterGuard'

import { injectStore } from '@/apis/axios'
import Layout from '@/components/layout'

// 注入 redux toolkit
injectStore(store)
// redux toolkit 持久化
const persistor = persistStore(store)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterGuard>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RouterGuard>
      </PersistGate>
    </Provider>
  )
}
