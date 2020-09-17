import "../styles/App.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { TokenProvider } from "../Context/TokenProvider";
import React from "react";
import { UserProvider } from "../Context/UserProvider";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <TokenProvider>
      <UserProvider>
        <ThemeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ThemeProvider>
        <style jsx global>{`
          :root {
            --box: 0 1px 6px 0;
            --softgrey: rgba(32, 33, 36, 0.28);
            --lightblue: #cbd8f9;
            --deepblue: #02247a;
            --text: #626262;
          }
        `}</style>
      </UserProvider>
    </TokenProvider>
  );
}

export default MyApp;
