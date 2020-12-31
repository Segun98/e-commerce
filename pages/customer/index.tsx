import { ContactForm } from "@/components/ContactForm";
import { Layout } from "@/components/Layout";
import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import Head from "next/head";

const Index = () => {
  return (
    <Layout>
      <Head>
        <title>Customer | PartyStore</title>
      </Head>
      <section className="header">
        <img src="/customer_page.png" alt="" />
      </section>
      <section className="delivery" id="delivery">
        Delivery Information
      </section>
      <section className="return" id="return-policy">
        Return Policy
      </section>
      <section className="purchase-steps" id="purchase-process">
        <PurchaseSteps />
      </section>
      <section className="contact-customer">
        <ContactForm />
      </section>
    </Layout>
  );
};

export default Index;
