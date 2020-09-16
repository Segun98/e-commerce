import React from "react";
import Head from "next/head";
import { Header } from "./customer/Header";

export const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Ecommerce</title>
      </Head>
      <Header />
      {children}
    </div>
  );
};
