import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer>
      <div className="footer-wrap">
        <section className="footer-item">
          <h1>Customer Service</h1>
          <ul>
            <li>
              <Link href="/">
                <a>Delivery Information</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Return Policy</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Contact Us</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>How It Works</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Terms and Condition</a>
              </Link>
            </li>
          </ul>
        </section>
        <section className="footer-item">
          <h1>Company Info</h1>
          <ul>
            <li>
              <Link href="/">
                <a>About Us</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Privacy Policy</a>
              </Link>
            </li>
          </ul>
        </section>
        <section className="footer-item">
          <h1>Vendor Service</h1>
          <ul>
            <li>
              <Link href="/">
                <a>Register</a>
              </Link>{" "}
            </li>
            <li>
              <Link href="/">
                <a>Terms and Condition</a>
              </Link>{" "}
            </li>
            <li>
              <Link href="/">
                <a>Contact Us</a>
              </Link>{" "}
            </li>
          </ul>
        </section>
        <section className="footer-item">
          <ul>
            <li>
              <Link href="/">
                <a>Twitter</a>
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
        footer {
          padding: 20px 0;
          background: var(--softblue);
          margin-top: 15px;
        }
        .footer-wrap {
          margin: auto;
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
        .footer-wrap ul li {
          list-style: none;
          color: var(--text);
          font-size: 0.9rem;
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

        @media only screen and (min-width: 700px) {
          footer {
            margin-top: 20px;
          }
          .footer-wrap ul li {
            margin: 5px 0;
          }
        }

        @media only screen and (min-width: 1000px) {
          .footer-wrap {
            grid-template-columns: 1fr 1fr 1fr 1fr;
          }
        }

        @media only screen and (min-width: 1200px) {
          .footer-wrap {
            width: 80%;
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

        @media only screen and (min-width: 2000px) {
          footer {
            padding: 30px 0;
          }
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
