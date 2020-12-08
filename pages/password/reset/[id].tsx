import {
  Button,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";

export const Reset = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setEmail("");
  }, []);

  //Enforce stricter password
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      return;
    }
    if (newPassword !== confirmPassword) {
      console.log("Passwords Do Not Match");
      return;
    }
    try {
      console.log(newPassword);
      console.log(confirmPassword);
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
          {router.query.id}
          <Text
            as="h1"
            mb="10px"
            color="var(--deepblue)"
            fontSize="1.3rem"
            fontWeight="bold"
          >
            Password Reset
          </Text>
          <Text
            as="h1"
            mb="10px"
            color="var(--deepblue)"
            fontSize="1.2rem"
            fontWeight="bold"
          >
            {email}
          </Text>
          <form onSubmit={handleSubmit}>
            <FormLabel htmlFor="password">Enter Your New Password</FormLabel>
            <InputGroup>
              <Input
                id="password"
                isRequired
                type={show ? "text" : "password"}
                value={newPassword}
                placeholder="Enter Your New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Icon
                  name="view"
                  color="blue.400"
                  cursor="pointer"
                  onClick={() => {
                    setShow(!show);
                  }}
                />
              </InputRightElement>
            </InputGroup>

            <FormLabel htmlFor="confirm password" mt="5px">
              Confirm Password
            </FormLabel>
            <InputGroup>
              <Input
                id="confirm password"
                isRequired
                type={show ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm Pasword"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Icon
                  name="view"
                  color="blue.400"
                  cursor="pointer"
                  onClick={() => {
                    setShow(!show);
                  }}
                />
              </InputRightElement>
            </InputGroup>
            <br />
            <Button type="submit" background="var(--deepblue)" color="white">
              Submit
            </Button>
            <br />
            {success && (
              <Text as="div" marginTop="5px">
                <Text as="p" color="var(--deepblue)">
                  Password Updated!
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

export default Reset;
