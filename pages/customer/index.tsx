import { ContactForm } from "@/components/ContactForm";
import { Layout } from "@/components/Layout";
import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import Head from "next/head";
import Link from "next/link";

const Index = () => {
  return (
    <Layout>
      <Head>
        <title>Customer | PartyStore</title>
      </Head>
      <div className="customer">
        <header>
          <div className="split">
            <div className="left">
              <h1>Start shopping for your party items on Partystore today!</h1>
              <p>
                We provide quality products and top notch customer service to
                provide you an amazing shopping experience. start exploring our
                store, throw the party of the year!
              </p>
              <Link href="/customer/register">
                <a>Get Started</a>
              </Link>
            </div>
            <div className="right">
              <img src="/customer_page.png" alt="" />
            </div>
          </div>
        </header>

        <section className="delivery" id="delivery">
          <h1>Delivery Information</h1>
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
              corrupti aspernatur! Ad perferendis veritatis inventore?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
              corrupti aspernatur! Ad perferendis veritatis inventore?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
              corrupti aspernatur! Ad perferendis veritatis inventore?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
              corrupti aspernatur! Ad perferendis veritatis inventore?
            </p>
          </div>
        </section>

        <section className="return" id="return-policy">
          <h1>Return / Cancellation / Refund Policy</h1>
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
              corrupti aspernatur! Ad perferendis veritatis inventore?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
              corrupti aspernatur! Ad perferendis veritatis inventore?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
              corrupti aspernatur! Ad perferendis veritatis inventore?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
              corrupti aspernatur! Ad perferendis veritatis inventore?
            </p>
          </div>
        </section>
        <section className="purchase-steps" id="purchase-process">
          <PurchaseSteps />
        </section>
        <section className="contact-customer">
          <ContactForm />
        </section>
      </div>
    </Layout>
  );
};

export default Index;
