import type { AppProps } from "next/app";
import "@/styles/tailwind.css";
import "@/styles/app.scss";
import { UserProvider } from "@/contexts/userContext";
import RouterGuard from "@/app/RouterGuard";

import DefaultLayout from "@/components/layout/DefaultLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <RouterGuard>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </RouterGuard>
    </UserProvider>
  );
}
