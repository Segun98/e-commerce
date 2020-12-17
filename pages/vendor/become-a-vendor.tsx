import Head from "next/head";
import { Layout } from "@/components/Layout";
import Link from "next/link";

const BecomeAVendor = () => {
  return (
    <Layout>
      <Head>
        <title>Become a Vendor | PartyStore</title>
      </Head>
      <div className="become-a-vendor">
        <header>
          <div className="split">
            <div className="left">
              <h1>Partner With Us, Grow Your Business The Right Way!</h1>
              <p>
                Start selling today on PartyStore, we handle everything, from
                delivery to order management. All you have to do is make your
                product available and accept orders, easy!
              </p>
              <Link href="/vendor/register">
                <a>Get Started</a>
              </Link>
            </div>
            <div className="right">
              <img src="/vendor-store.png" alt="become a vendor" />
            </div>
          </div>
        </header>
      </div>
      <style jsx>{``}</style>
    </Layout>
  );
};

export default BecomeAVendor;
