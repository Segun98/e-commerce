import { Button, FormLabel, Input, InputGroup, Text } from "@chakra-ui/core";
import React, { useState } from "react";
import Head from "next/head";
import { Layout } from "@/components/Layout";

export const Change = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log(email);
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
    }
  };
  return (
    <Layout>
      <Head>
        <title>Password Reset | PartyStore</title>
      </Head>
      <div className="indicator">
        <div className="change-pass-wrap">
          <Text
            as="h1"
            mb="10px"
            color="var(--deepblue)"
            fontSize="1.2rem"
            fontWeight="bold"
          >
            Password Reset
          </Text>
          <form onSubmit={handleSubmit}>
            <FormLabel htmlFor="email">Enter Your Email Address</FormLabel>
            <InputGroup>
              <Input
                type="email"
                id="email"
                isRequired
                value={email}
                placeholder="Enter Your Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <br />
            <Button type="submit" background="var(--deepblue)" color="white">
              Submit
            </Button>
            <br />
            {success && (
              <Text as="div" marginTop="5px">
                <Text as="p" color="var(--deepblue)">
                  Please Check Your Email For The Next Step
                </Text>
                <Text as="p" fontSize="0.9rem">
                  Didn't recieve an email? Click{" "}
                  <Text as="span" color="var(--deepblue)">
                    Submit
                  </Text>{" "}
                  again to resend
                </Text>
              </Text>
            )}
          </form>
        </div>
      </div>
      <style jsx>{`
        .indicator {
          margin: auto;
          width: 100%;
        }
        form Input {
          width: 400px;
        }
        .change-pass-wrap {
          width: 90%;
        }

        @media only screen and (min-width: 700px) {
          .change-pass-wrap {
            width: 70%;
          }
        }

        @media only screen and (min-width: 1000px) {
          .change-pass-wrap {
            width: 60%;
          }
        }

        @media only screen and (min-width: 1200px) {
          .change-pass-wrap {
            width: 40%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Change;
