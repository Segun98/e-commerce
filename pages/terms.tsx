import { Layout } from "@/components/Layout";
import Head from "next/head";

const Terms = () => {
  return (
    <Layout>
      <Head>
        <title>Terms | Privacy Policy | PartyStore</title>
      </Head>
      <div className="terms-wrap">
        <section id="terms" className="terms">
          <h1>Terms and Conditions</h1>
          <div className="vendor-terms">
            <h2>Vendors</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum
              nemo quos odio fugit voluptatem iste quidem dolor praesentium,
              sint pariatur possimus sapiente, expedita repudiandae veritatis
              aliquid quaerat rem obcaecati officia quibusdam mollitia sit
              aliquam ullam enim laboriosam! Culpa cum sed facilis commodi
              incidunt ullam et iste, eligendi temporibus minima magni.
            </p>

            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit
              distinctio totam dignissimos dolor? Libero, suscipit. Cupiditate
              veritatis, sapiente numquam earum voluptates, doloribus mollitia
              animi iusto amet deleniti perferendis eum labore porro maxime
              impedit, culpa eos architecto autem dolor obcaecati consequuntur?
              Sint culpa numquam obcaecati corporis!
            </p>

            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Inventore, ex magni? Dignissimos aliquam deserunt eos quibusdam
              in. Aut, ad vero et sapiente recusandae cum aspernatur inventore
              expedita libero!
            </p>
          </div>
          <div className="customer-terms">
            <h2>Customers</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
              consectetur molestias, sint cum rerum iure ullam obcaecati, vero
              sapiente numquam impedit sed error saepe culpa? Necessitatibus ad
              id voluptatem blanditiis rerum, autem quas cupiditate culpa
              adipisci, ut praesentium, repudiandae laborum!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
              consectetur molestias, sint cum rerum iure ullam obcaecati, vero
              sapiente numquam impedit sed error saepe culpa? Necessitatibus ad
              id voluptatem blanditiis rerum, autem quas cupiditate culpa
              adipisci, ut praesentium, repudiandae laborum!
            </p>
          </div>
        </section>
        <section id="privacy-policy" className="privacy">
          <h1>Privacy Policy</h1>
          <div className="privacy-wrap">
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo
              aperiam repudiandae enim explicabo nostrum facilis iste ab rerum
              minus! Vero accusamus, nesciunt nostrum autem dignissimos
              repellendus officia soluta, doloribus corporis omnis
              necessitatibus est eius architecto dolorum enim magnam ex delectus
              mollitia voluptates placeat veritatis voluptatem qui. Deleniti
              pariatur at nemo.
            </p>

            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore
              maxime iusto, doloribus voluptatibus inventore voluptatum hic in
              nostrum pariatur expedita provident! Error voluptas pariatur
              eligendi ipsam doloribus maiores magnam, maxime adipisci
              doloremque cum soluta modi voluptatum, aperiam minima officiis.
              Quae in quas eum magni amet vero maiores officia optio corrupti,
              esse fugit aliquid neque impedit dolorum?
            </p>
          </div>
        </section>
      </div>
      <style jsx>{`
        .terms-wrap {
          margin: 20px auto;
          width: 90%;
        }

        h1 {
          text-align: center;
          font-weight: bold;
          margin: 10px 0;
        }

        h2 {
          font-weight: bold;
          margin: 15px 0 10px 0;
          color: var(--deepblue);
        }
        p {
          font-size: 0.9rem;
          line-height: 2;
          margin: 5px 0;
        }

        @media only screen and (min-width: 700px) {
          .terms-wrap {
            margin: 30px auto;
            width: 80%;
          }
        }
        @media only screen and (min-width: 1000px) {
          .terms-wrap {
            width: 70%;
          }
          h1 {
            font-size: 1.1rem;
          }
          p {
            font-size: 1rem;
          }
        }
        @media only screen and (min-width: 1200px) {
          .terms-wrap {
            width: 60%;
          }

          h1 {
            font-size: 1.2rem;
            margin: 20px 0;
          }
        }

        @media only screen and (min-width: 1800px) {
          .terms-wrap {
            width: 40%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Terms;
