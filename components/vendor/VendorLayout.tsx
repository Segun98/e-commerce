import React from "react";
import Head from "next/head";
import { Navigation } from "./Navigation";

export const VendorLayout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>
          PartyStore | Shop Your Favourite Products For Your Parties In Nigeria
        </title>
      </Head>
      <Navigation />
      {children}
    </div>
  );
};
