import Link from "next/link";
import Cookies from "js-cookie";

export const Footer = () => {
  const role = Cookies.get("role");
  return (
    <footer>
      <hr />
      <div className="footer-wrap">
        <section className="footer-item">
          <h1>Customer Service</h1>
          <ul>
            <li>
              <Link href="/customer#delivery">
                <a>Delivery Information</a>
              </Link>
            </li>
            <li>
              <Link href="/customer#return-policy">
                <a>Return Policy</a>
              </Link>
            </li>
            <li>
              <Link href="/customer#contact">
                <a>Contact Us</a>
              </Link>
            </li>
            <li>
              <Link href="/customer#purchase-process">
                <a>Purchase Process</a>
              </Link>
            </li>
          </ul>
        </section>
        <section className="footer-item">
          <h1>Company</h1>
          <ul>
            <li>
              <Link href="/terms">
                <a>Terms and Condition</a>
              </Link>
            </li>
            <li>
              <Link href="/terms#privacy-policy">
                <a>Privacy Policy</a>
              </Link>
            </li>
            <li>
              <Link href="/customer">
                <a>About</a>
              </Link>
            </li>
          </ul>
        </section>
        <section className="footer-item">
          <h1>Vendor</h1>
          <ul>
            <li>
              <Link href="/become-a-vendor">
                <a>Become a Vendor</a>
              </Link>{" "}
            </li>
            {role && role === "vendor" && (
              <li>
                <Link href="/vendor/dashboard">
                  <a>Dashboard</a>
                </Link>{" "}
              </li>
            )}
            <li>
              <Link href="/vendor/login">
                <a>Login</a>
              </Link>{" "}
            </li>
          </ul>
        </section>
        <section className="footer-item">
          <h1>Quick Links</h1>
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>{" "}
            </li>
            <li>
              <Link href="/customer#contact">
                <a>Contact</a>
              </Link>{" "}
            </li>
            <li>
              <Link href="/stores">
                <a>Stores</a>
              </Link>{" "}
            </li>
            <li>
              <Link href="/customer/login">
                <a>Login</a>
              </Link>{" "}
            </li>
          </ul>
        </section>
        <section className="footer-item">
          <ul>
            <li>
              <Link href="https://twitter.com/segun_os">
                <a target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </Link>{" "}
            </li>
            <li>
              <Link href="/">
                <a>Instagram</a>
              </Link>{" "}
            </li>
            <li>
              <Link href="/">
                <a>Facebook</a>
              </Link>{" "}
            </li>
            <li>
              <Link href="/">
                <a>Youtube</a>
              </Link>{" "}
            </li>
          </ul>
        </section>
      </div>
      <hr />
      <div className="attribution">
        <div className="attr-wrap">
          <div>
            Copyright {new Date().getFullYear()}, PartyStore. All Rights
            Reserved
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer-wrap {
          margin: auto;
          margin-top: 10px;
          width: 90%;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .footer-wrap h1 {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 1rem;
        }
        .footer-wrap ul {
          color: var(--text);
        }
        .footer-item {
          margin: 10px 0;
        }
        .footer-wrap h1 {
          margin-bottom: 15px;
        }
        .footer-wrap ul li {
          list-style: none;
          color: var(--text);
          font-size: 0.9rem;
          margin: 8px 0;
        }
        .attribution {
          padding: 10px 0;
        }
        .attr-wrap {
          margin: auto;
          width: 90%;
        }
        .attr-wrap div {
          font-size: 0.9rem;
        }

        @media only screen and (min-width: 1000px) {
          .footer-wrap {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media only screen and (min-width: 1200px) {
          .footer-wrap {
            width: 80%;
            grid-template-columns: repeat(5, 1fr);
          }

          .footer-wrap h1 {
            margin-bottom: 10px;
            font-size: 1.05rem;
          }

          .footer-wrap ul li {
            font-size: 1rem;
            margin: 7px 0;
          }

          .attr-wrap {
            width: 80%;
          }
        }
        @media only screen and (min-width: 1400px) {
          .footer-wrap h1 {
            margin-bottom: 13px;
            font-size: 1.08rem;
          }

          .footer-wrap ul li {
            margin: 8px 0;
          }
        }

        @media only screen and (min-width: 1800px) {
          .footer-wrap {
            width: 60%;
          }
          .footer-wrap h1 {
            margin-bottom: 15px;
            font-size: 1.1rem;
          }

          .footer-wrap ul li {
            font-size: 1.05rem;
          }
          .attr-wrap {
            width: 60%;
          }
          .attr-wrap div {
            font-size: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};
