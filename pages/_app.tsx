import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { TokenProvider } from "@/Context/TokenProvider";
import React from "react";
import { UserProvider } from "@/Context/UserProvider";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { GlobalLayout } from "@/components/GlobalLayout";

function MyApp({ Component, pageProps }: AppProps) {
  //progress bar on page visit
  Router.events.on("routeChangeStart", () => {
    NProgress.configure({
      easing: "ease",
      speed: 1000,
    });

    return NProgress.start();
  });
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  return (
    <Provider store={store}>
      <TokenProvider>
        <UserProvider>
          <GlobalLayout>
            <ThemeProvider>
              <CSSReset />
              <Component {...pageProps} />
            </ThemeProvider>
          </GlobalLayout>
        </UserProvider>
      </TokenProvider>
    </Provider>
  );
}

export default MyApp;
