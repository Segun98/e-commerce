import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { TokenProvider } from "../Context/TokenProvider";
// import { UserProvider } from "../Context/UserProvider";

function MyApp({ Component, pageProps }: AppProps) {
  //progress bar on page visit
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  return (
    <TokenProvider>
      {/* <UserProvider> */}
      <ThemeProvider>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
      {/* </UserProvider> */}
    </TokenProvider>
  );
}

export default MyApp;
