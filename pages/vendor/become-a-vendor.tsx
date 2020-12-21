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
                product available and accept orders, that easy!
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

        <section className="how-it-works">
          <h1>How PartyStore Works</h1>
          <div className="wrap">
            <div className="split">
              <h2>List your store with us</h2>
              <p>
                Sign up and start adding your products to your public store page
              </p>
            </div>
            <div className="split">
              <h2>Accept Orders</h2>
              <p>
                Start acknowledging orders from your comprehensive dashboard
              </p>
            </div>
            <div className="split">
              <h2>Delivery</h2>
              <p>
                A delivery person comes to pick up the product(s) you have
                accepted. It's that simple.
              </p>
            </div>
          </div>
        </section>
      </div>
      <style jsx>{``}</style>
    </Layout>
  );
};

export default BecomeAVendor;
