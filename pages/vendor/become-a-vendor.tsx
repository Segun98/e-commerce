import React from "react";
import Head from "next/head";
import { Layout } from "./../../components/Layout";
import { Text } from "@chakra-ui/core";

const BecomeAVendor = () => {
  return (
    <Layout>
      <Head>
        <title>Become a Vendor | PartyStore</title>
      </Head>
      <div className="become-vendor">
        <header>
          <div className="intro-image">
            {/* Large screen  */}
            <h1>Partner With Us, Grow Your Business The Right Way!</h1>
          </div>
          {/* Mobile screen  */}
          <p>Partner With Us, Grow Your Business The Right Way!</p>
        </header>
        <section className="content-1"></section>
      </div>

      <style jsx>{``}</style>
    </Layout>
  );
};

export default BecomeAVendor;
