import { Layout } from "@/components/Layout";
import Head from "next/head";

const Terms = () => {
  return (
    <Layout>
      <Head>
        <title>Terms | Privacy Policy | PartyStore</title>
      </Head>
      <section id="terms" className="terms">
        Terms and Conditions
      </section>
      <section id="privacy-policy" className="privacy">
        Privacy Policy
      </section>
    </Layout>
  );
};

export default Terms;
