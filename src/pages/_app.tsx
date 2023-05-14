import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import "@/styles/tailwind.css";
import "@/styles/app.scss";

import store from "@/app/store";
import RouterGuard from "@/app/RouterGuard";

import DefaultLayout from "@/components/layout/DefaultLayout";
import { injectStore } from "@/apis/axios";
import { useRouter } from "next/router";
import BackLayout from "@/components/layout/BackLayout";

// 注入 redux toolkit
injectStore(store);
// redux toolkit 持久化
let persistor = persistStore(store);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showFront = router.pathname === '/' || router.pathname === '/login' || router.pathname === '/sign-up';
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterGuard>
          {showFront ? 
          (<DefaultLayout><Component {...pageProps} /></DefaultLayout>):(<BackLayout><Component {...pageProps} /></BackLayout>)}
        </RouterGuard>
      </PersistGate>
    </Provider>
  );
}
