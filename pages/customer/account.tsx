import { useToken } from "../../Context/TokenProvider";
import { Layout } from "../../components/Layout";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useUser } from "../../Context/UserProvider";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  Icon,
  InputLeftElement,
  Button,
  useToast,
} from "@chakra-ui/core";
import { PurchaseSteps } from "../../components/customer/PurchaseSteps";
import { useMutation } from "../../utils/useMutation";
import Head from "next/head";

export const Account = () => {
  const { Token } = useToken();
  const { User } = useUser();
  const toast = useToast();
  const role = Cookies && Cookies.get("role");

  const [readOnly, setReadOnly] = useState(true);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setPhone(User.phone ? User.phone : "");
    setAddress(User.customer_address ? User.customer_address : "");
  }, [User, Token]);

  const updateProfile = `
  mutation updateProfile($first_name:String,$last_name:String,$phone:String, $customer_address:String){
    updateProfile(first_name:$first_name,last_name:$last_name, phone:$phone, customer_address:$customer_address){
      message
    }
  }
  `;
  async function updateAccount() {
    const variables = {
      first_name: User.first_name,
      last_name: User.last_name,
      phone,
      customer_address: address,
    };
    const { data, error } = await useMutation(updateProfile, variables, Token);
    if (data) {
      toast({
        title: "Account Updated Successfully",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setReadOnly(true);
    }
    if (error) {
      toast({
        title: "Failed To Update Your Account",
        description: "Check Your Internet Connection and Refresh",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }

  return (
    <Layout>
      <Head>
        <title>Account | PartyStore</title>
      </Head>
      {/* {Token && User && User.pending === "true" && (
        <div className="banner">
          Your Account is Pending, You Need To Confirm Your Account in Your
          Email Inbox, Didn't Recieve An Email? <a>CLICK HERE TO RESEND</a>
        </div>
      )} */}

      {!Token && !role && (
        <div className="indicator">
          <div>
            <strong>Looks Like You're Not Logged in</strong>
            <br />
            <div style={{ textAlign: "center" }}>
              <div className="unauthorised">
                <Link href="/customer/login">
                  <a>LogIn</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* vendors trying to access this Page  */}
      {Token && role === "vendor" && (
        <div className="indicator">
          <div>
            <strong>
              This Page is Unauthorised For Vendors, Login as a Customer or
              Visit Your Dashboard{" "}
            </strong>
            <br />
            <div style={{ textAlign: "center" }}>
              <div className="unauthorised">
                <Link href="/vendor/dashboard">
                  <a>Dashboard</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        {Token && User && role === "customer" && (
          <div className="account-wrap">
            <div className="heading">
              <h1>{User && "Hello, " + User.first_name}</h1>
              <button
                onClick={() => setReadOnly(!readOnly)}
                style={{ color: "var(--deepblue)", fontWeight: "bold" }}
              >
                Edit <Icon name="edit" />
              </button>
            </div>

            <section className="account-info">
              <h3>Personal Information</h3>
              <hr />
              <h2>Name</h2>
              <p>
                {User.first_name} {User.last_name}
              </p>
              <h2>Email</h2>
              <p>{User.email}</p>
            </section>
            <br />
            <form>
              <h3>Address Book</h3>
              <hr />
              <FormControl>
                <div>
                  <h2>Phone Number</h2>
                  <InputGroup>
                    <InputLeftElement
                      children={<Icon name="phone" color="gray.300" />}
                    />
                    <Input
                      isReadOnly={readOnly}
                      autoFocus={readOnly}
                      placeholder="Click Edit to add Phone Number"
                      width="350px"
                      type="tel"
                      name="Phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                  </InputGroup>
                </div>

                <div>
                  <h2>Shipping Address</h2>
                  <InputGroup>
                    <Input
                      isReadOnly={readOnly}
                      autoFocus={readOnly}
                      minWidth="350px"
                      placeholder="Click Edit to add Address"
                      type="text"
                      id="Address"
                      name="Address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                    />
                  </InputGroup>
                </div>
              </FormControl>
              <br />
              <div>
                {!readOnly && (
                  <Button
                    onClick={updateAccount}
                    style={{ background: "var(--deepblue)", color: "white" }}
                    size="sm"
                  >
                    Update
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}

        <PurchaseSteps />
      </main>
      <style jsx>{`
        .banner {
          background: var(--deepblue);
          color: white;
          font-weight: bold;
          text-align: center;
          padding: 10px;
        }
        .banner a {
          color: lightgreen;
        }
        .heading {
          display: flex;
          justify-content: space-between;
        }
        .unauthorised {
          margin-top: 20px;
        }
        .unauthorised a {
          background: var(--deepblue);
          color: white;
          padding: 10px 30px;
          margin-top: 20px;
        }
        .account-wrap {
          margin: 30px auto;
          width: 70%;
        }

        .account-wrap h1 {
          font-weight: bold;
          font-style: italic;
          margin: 20px 0;
          font-size: 1.2rem;
        }

        .account-wrap h3 {
          font-weight: bold;
          margin: 5px 0;
          color: Var(--deepblue);
          font-style: italic;
        }

        .account-wrap h2 {
          margin: 5px 0;
          color: Var(--deepblue);
          font-weight: bold;
        }
        .account-wrap p {
          margin: 2px 0;
        }
        .account-info h3 {
          font-weight: bold;
          margin: 5px 0;
          color: Var(--deepblue);
          font-style: italic;
        }
        form div {
          margin: 10px 0;
        }
        @media only screen and (min-width: 1200px) {
          .account-wrap {
            width: 60%;
          }
        }
        @media only screen and (min-width: 2000px) {
          .account-wrap {
            width: 40%;
          }
        }
      `}</style>
    </Layout>
  );
};
export default Account;
