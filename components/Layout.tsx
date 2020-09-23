import React from "react";
import Head from "next/head";
import { Header } from "./customer/Header";
import { Footer } from "./Footer";

export const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>
          PartyStore | Shop Your Favourite Products For Your Parties In Nigeria
        </title>
      </Head>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
