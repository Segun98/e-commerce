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
      <br />
      <br />
      <br />
      <br />
      <Text as="div" textAlign="center">
        Become a Vendor, partner with us
      </Text>
      <div className="space"></div>
    </Layout>
  );
};

export default BecomeAVendor;
