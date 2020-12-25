import React, { useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  Icon,
  useToast,
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import { graphQLClient } from "@/utils/client";
import { useRouter } from "next/router";
import { LOG_IN } from "@/graphql/users";
import { useToken } from "@/Context/TokenProvider";
import { LoginRes, MutationLogInArgs } from "@/Typescript/types";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import Head from "next/head";
import Cookies from "js-cookie";

export const Login = () => {
  const toast = useToast();

  //from context
  const { setToken } = useToken();

  const router = useRouter();
  //react-hook-form
  const { handleSubmit, register, errors } = useForm();

  //show password or not in input field- password/confirm password
  const [show, setShow] = useState(false);
  //custom error, mostly from the server
  const [Loading, setLoading] = useState(false);

  //form submit function

  const onSubmit = async (values: MutationLogInArgs): Promise<void> => {
    const { email, password } = values;

    const variables = {
      email: email.toLowerCase(),
      password,
    };

    try {
      setLoading(true);
      const res = await graphQLClient.request(LOG_IN, variables);
      const data: LoginRes = res.logIn;
      //setting cookies client side, should be done over server, but i ran into heroku/vercel problems in production
      Cookies.set("role", data.role, {
        expires: 7,
      });

      Cookies.set("ecom", data.refreshtoken, {
        expires: 7,
        // secure: true,
      });

      if (data) {
        setLoading(false);
        setToken(data.accesstoken);
        if (data.role !== "vendor") {
          router.push(`/${data.role}/account`);
          return;
        }
        toast({
          title: "LogIn Successfull!",
          status: "success",
          duration: 3000,
        });
        router.push("/vendor/dashboard");
      }
    } catch (err) {
      setLoading(false);
      if (err.message === "Network request failed") {
        toast({
          title: "Oops, Network Request Failed",
          description: "PLease Check Your Internet Connection and Try Again",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      toast({
        title: `${err.response?.errors[0].message || "An error Occurred"}`,
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Layout>
      <Head>
        <title>Vendor LogIn | PartyStore</title>
      </Head>
      <div className="login-page-wrap">
        <img
          src="/undraw_receipt_ecdd.svg"
          alt="login vector"
          className="login-vector"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="log-in mb-2">Log In</h1>
          <h2 className="log-in-message">Let's Make Sales Today!</h2>
          <FormControl isRequired>
            <div>
              <FormLabel htmlFor="email">Email</FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  aria-describedby="email-helper-text"
                  placeholder="email@example.com"
                  ref={register({
                    required: "Required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                  isInvalid={errors.email ? true : false}
                  errorBorderColor="red.300"
                />
              </InputGroup>
              <small style={{ color: "red" }}>
                {errors.email && errors.email.message}
              </small>
            </div>

            <div>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter Password"
                  ref={register}
                  isInvalid={errors.password ? true : false}
                  errorBorderColor="red.300"
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
              <span className="forgot-pass">
                <Link href="/password/change">
                  <a>forgot password?</a>
                </Link>
              </span>
            </div>
          </FormControl>
          <div className="btn">
            <Button
              isDisabled={Loading}
              style={{ background: "var(--deepblue)" }}
              color="white"
              type="submit"
              isLoading={Loading}
            >
              Log in
            </Button>
            <div className="sign-up-msg">
              <small>
                Don't have an account?{" "}
                <Link href="/vendor/register">
                  <a>Sign Up</a>
                </Link>{" "}
              </small>
            </div>
          </div>
        </form>
        <style jsx>{`
          .login-page-wrap {
            display: flex;
            flex-direction: column-reverse;
            margin: 2rem auto;
            width: 90%;
          }
          form {
            margin: 2rem auto;
            width: 90%;
          }
          .log-in {
            text-align: center;
            font-size: 1.5rem;
            font-weight: bolder;
            color: var(--deepblue);
          }
          .log-in-message {
            text-align: center;
            font-size: 1.05rem;
            color: var(--softgrey);
            margin-bottom: 5px;
          }

          form div {
            margin: 10px 0;
          }
          .forgot-pass {
            display: flex;
            justify-content: flex-end;
            font-size: 0.8rem;
          }
          .btn {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .sign-up-msg a {
            color: var(--deepblue);
          }
          .login-vector {
            display: none;
          }
          @media only screen and (min-width: 700px) {
            .login-page-wrap {
              flex-direction: row;
              justify-content: space-between;
            }
            .login-vector {
              width: 60%;
              display: block;
              margin-right: 50px;
            }

            .login-vector img {
              margin-right: 50px;
            }
          }
          @media only screen and (min-width: 1200px) {
            .login-page-wrap {
              width: 80%;
              margin: 50px auto;
            }
            .login-vector {
              width: 75%;
            }
          }
          @media only screen and (min-width: 1400px) {
            .login-page-wrap {
              width: 70%;
              margin: 100px auto;
            }
          }
          @media only screen and (min-width: 1800px) {
            .login-page-wrap {
              width: 60%;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Login;
