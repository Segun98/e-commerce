import Head from "next/head";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import { Text } from "@chakra-ui/core";
import { ContactForm } from "@/components/ContactForm";

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

        <section className="product">
          <div className="wrap">
            <div className="dashboard">
              <div className="split">
                <img src="/dashboard-mob.png" alt="vendor dashboard" />
              </div>
              <div className="split">
                <h1>Your Dashboard</h1>
                <p>
                  Your comprehensive dashboard highlights your order status,
                  completed orders are orders that have been delivered to
                  customers. A sales metrics showing your completed orders by
                  month and recent orders are also highlighted.
                </p>
              </div>
            </div>

            <div className="orders">
              <div className="split">
                <h1>Manage Orders</h1>
                <p>
                  All the necessary information about an order is provided here.
                  This is where you acknowledge and track the orders you
                  recieve.
                </p>
              </div>

              <div className="split">
                <img src="/orders-page-mob.png" alt="vendor orders" />
              </div>
            </div>

            <div className="store">
              <div className="split">
                <img src="/vendor-store-mob.png" alt="vendor public store" />
              </div>
              <div className="split">
                <h1>Your Public Store</h1>
                <p>
                  All vendors have a public store page with their business name
                  in the web address. Customers can easily purchase your
                  products from this SEO backed page.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="start">
          <h1>Grow Your Business With Less Effort</h1>
          <Text as="div" className="mr-2 ml-2">
            <Link href="/vendor/register">
              <a>Get Started</a>
            </Link>
          </Text>
        </section>

        <section style={{ background: "var(--softblue)" }}>
          <ContactForm />
        </section>
      </div>
      <style jsx>{``}</style>
    </Layout>
  );
};

export default BecomeAVendor;
