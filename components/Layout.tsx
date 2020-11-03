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
        <meta
          name="description"
          content="The number one market place for Party Supplies, Gift Items and Games in Lagos,Nigeria"
        />
        <meta
          name="keywords"
          content="Party, Parties, Gifts, E-Commerce, Online Store, Market, Lagos"
        />
      </Head>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
