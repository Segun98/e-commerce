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
  Text,
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import { graphQLClient, oAuthLoginLink } from "../../utils/client";
import { useRouter } from "next/router";
import { LOG_IN } from "../../graphql/users";
import { LoginRes, MutationLogInArgs } from "../../Typescript/types";
import { useToken } from "../../Context/TokenProvider";
import { Layout } from "../../components/Layout";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import Cookies from "js-cookie";
import { GoogleLogin } from "react-google-login";
import { CLIENT_ID } from "./../../utils/client";

export const Login = () => {
  const toast = useToast();
  const router = useRouter();
  const { setToken } = useToken();

  //react-hook-form
  const { handleSubmit, register, errors } = useForm();

  //show password or not in input field- password/confirm password
  const [show, setShow] = useState(false);
  const [Loading, setLoading] = useState(false);

  //form submit function

  const onSubmit = async (values: MutationLogInArgs, e): Promise<void> => {
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
        if (data.role !== "customer") {
          router.push(`/${data.role}/dashboard`);
          return;
        }
        toast({
          title: "LogIn Successfull!",
          status: "success",
          duration: 3000,
        });
        router.push("/customer/account");
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
        title: `${err.response?.errors[0].message || "An Error Occured"}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  //succesful oauth response
  const responseGoogle = async (response) => {
    let data = {
      first_name: response.profileObj.givenName,
      last_name: response.profileObj.familyName,
      password: response.profileObj.googleId,
      email: response.profileObj.email,
    };
    const instance = axios.create({
      withCredentials: true,
    });

    try {
      if (response) {
        const res = await instance.post(oAuthLoginLink[0], {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
          email: data.email,
        });

        //setting cookies client side, should be done over server, but i ran into heroku/vercel problems in production
        Cookies.set("role", res.data.role, {
          expires: 7,
        });

        Cookies.set("ecom", res.data.refreshtoken, {
          expires: 7,
          // secure: true,
        });

        if (res.data) {
          setToken(res.data.accesstoken);
          toast({
            title: "LogIn Successfull!",
            status: "success",
            duration: 3000,
          });
          router.push("/customer/account");
        }
      }
    } catch (error) {
      if (error.message === "Network Error") {
        toast({
          title: "Check your internet connection",
          status: "error",
          duration: 3000,
        });
        return;
      }
      //user doesn't exist
      // if (error.message === "Request failed with status code 404") {
      //   toast({
      //     title: "You Need To Signup",
      //     description: "Redirecting...",
      //     status: "info",
      //     position: "top",
      //     duration: 3000,
      //   });
      //   setTimeout(() => {
      //     router.push("/customer/register#google");
      //   }, 2000);
      // }
    }
  };
  //failed oauth response
  const failureGoogle = (response) => {
    toast({
      title: "Google Error",
      description: "Please Login the other way if this error persists",
      status: "error",
      duration: 3000,
    });
  };

  return (
    <Layout>
      <Head>
        <title>Customer LogIn | PartyStore</title>
      </Head>
      <div className="login-page-wrap">
        <img src="/login.png" alt="login vector" className="login-vector" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="log-in">Log In</h1>
          <h2 className="log-in-message">Enjoy A Modern Shopping Experience</h2>

          <FormControl isRequired>
            <div>
              <FormLabel htmlFor="email">Email</FormLabel>
              <InputGroup>
                <Input
                  autoFocus={true}
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
                  isInvalid={errors.email ? true : false}
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
            </div>
          </FormControl>

          <div className="btn">
            <Text as="div" display="flex" flexDirection="column">
              <Button
                isDisabled={Loading}
                style={{ background: "var(--deepblue)" }}
                color="white"
                type="submit"
                isLoading={Loading}
              >
                Log in
              </Button>

              <span className="ml-2 mr-2 mt-2">Or</span>
              <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={failureGoogle}
                cookiePolicy={"single_host_origin"}
                style={{ fontSize: "0.8rem" }}
              >
                Login With Google{" "}
              </GoogleLogin>
            </Text>
            <div className="sign-up-msg">
              <small>
                Don't have an account?{" "}
                <Link href="/customer/register">
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
            }
            .login-vector {
              width: 60%;
              display: block;
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
