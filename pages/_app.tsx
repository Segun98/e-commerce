import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { useEffect } from "react";
import { setToken } from "../utils/auth";
import Cookies from "js-cookie";
import axios from "axios";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function MyApp({ Component, pageProps }: AppProps) {
  // fetch new refresh token on page visit
  useEffect(() => {
    async function fetchRefreshToken() {
      const instance = axios.create({
        withCredentials: true,
      });

      try {
        const res = await instance.post(
          `http://localhost:4000/api/refreshtoken`
        );
        setToken(res.data.accessToken);
        // console.clear();
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          return Cookies.remove("role");
        }
        console.log(error.message);
      }
    }
    fetchRefreshToken();
  }, []);

  //progress bar on page visit
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  return (
    <ThemeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
