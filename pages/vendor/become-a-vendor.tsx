import React from "react";
import Head from "next/head";
import { Layout } from "./../../components/Layout";
import { Text } from "@chakra-ui/core";
import Link from "next/link";

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
            <div className="intro-desktop-caption">
              <h1>Partner With Us, Grow Your Business The Right Way!</h1>
              <Link href="/vendor/register">
                <a>Get Started</a>
              </Link>
            </div>
          </div>
          {/* Mobile screen  */}
          <div className="intro-mobile-caption">
            <p>Partner With Us, Grow Your Business The Right Way!</p>
            <Link href="/vendor/register">
              <a>Get Started</a>
            </Link>
          </div>
        </header>
        <section className="content-1"></section>
      </div>

      <style jsx>{``}</style>
    </Layout>
  );
};

export default BecomeAVendor;
