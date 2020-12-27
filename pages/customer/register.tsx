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
import { request } from "graphql-request";
import { SIGN_UP } from "@/graphql/users";
import { CLIENT_ID, graphqlEndpoint, oAuthSignupLink } from "@/utils/client";
import { useRouter } from "next/router";
import { MutationSignUpArgs } from "@/Typescript/types";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import Head from "next/head";
import axios from "axios";
import { GoogleLogin } from "react-google-login";

export const Register = () => {
  const router = useRouter();
  const toast = useToast();

  //react-hook-form
  const { handleSubmit, register, errors, watch } = useForm();

  //show password or not in input field- password/confirm password
  const [show, setShow] = useState(false);
  //custom error, mostly from the server
  const [Loading, setLoading] = useState(false);

  //form submit function

  const onSubmit = async (values: MutationSignUpArgs, e): Promise<void> => {
    //i could use values.password
    if (watch("password") !== watch("confirm_password")) {
      toast({
        title: "Passwords Must Match",
        status: "info",
        duration: 3000,
      });
      return;
    }
    const { first_name, last_name, email, password, confirm_password } = values;

    if (first_name.trim() === "" || last_name.trim() === "") {
      toast({
        title: "All Fields Are Required",
        status: "info",
        duration: 3000,
      });
      return;
    }

    const variables: MutationSignUpArgs = {
      first_name,
      last_name,
      email: email.toLowerCase(),
      password,
      confirm_password,
      role: "customer",
      //pending status of customer account
      pending: "false",
    };

    try {
      setLoading(true);
      const res = await request(graphqlEndpoint, SIGN_UP, variables);

      if (res.signUp) {
        setLoading(false);
        toast({
          title: "Sign Up Successful!",
          status: "success",
          duration: 3000,
        });
        router.push("/customer/login");
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
      });
    }
  };

  //succesful ouath response
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
        const res = await instance.post(oAuthSignupLink, {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
          email: data.email,
        });
        //check for EXISITING user
        if (res.data) {
          toast({
            title: "Sign Up Successful!",
            description: "Redirecting to Login",
            status: "success",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
          setTimeout(() => {
            router.push("/customer/login");
          }, 2000);
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
      //user exists
      if (error.message === "Request failed with status code 404") {
        toast({
          title: "User Already Exists, Login ",
          description: "Redirecting...",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          router.push("/customer/login");
        }, 2000);
      }
    }
  };
  //failed oauth response
  const failureGoogle = (response) => {
    toast({
      title: "Google Error",
      description: "Please Signup the other way if this error persists",
      status: "error",
      duration: 3000,
    });
  };

  return (
    <Layout>
      <Head>
        <title>Customer Register | PartyStore</title>
      </Head>
      <div className="register-page-wrap">
        <img
          src="/undraw_shopping_app_flsj.svg"
          alt="register vector"
          className="register-vector"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="register mb-2">Create Account</h1>
          <h2 className="register-message">
            Enjoy A Modern Shopping Experience
          </h2>

          <FormControl isRequired>
            <div>
              <FormLabel htmlFor="first_name">First Name</FormLabel>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                aria-describedby="first_name-helper-text"
                placeholder="First Name"
                ref={register({
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
                isInvalid={errors.first_name ? true : false}
                errorBorderColor="red.300"
              />
              <small style={{ color: "red" }}>
                {errors.first_name &&
                  "first name should be a minimum of 3 chracters and max of 20"}
              </small>
            </div>

            <div>
              <FormLabel htmlFor="last_name">Last Name</FormLabel>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                aria-describedby="last_name-helper-text"
                placeholder="Last Name"
                ref={register({
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
                isInvalid={errors.last_name ? true : false}
                errorBorderColor="red.300"
              />
              <small style={{ color: "red" }}>
                {errors.last_name &&
                  "Last name should be a minimum of 3 chracters and max of 20"}
              </small>
            </div>

            <div>
              <FormLabel htmlFor="email">Email address</FormLabel>
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
                  ref={register({
                    required: true,
                    minLength: 8,
                    maxLength: 20,
                  })}
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
              <small style={{ color: "red" }}>
                {errors.password && "minimum of 8 characters and max of 20"}
              </small>
            </div>

            <div>
              <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  ref={register({
                    required: true,
                    minLength: 8,
                    maxLength: 20,
                  })}
                  isInvalid={errors.confirm_password ? true : false}
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
                Create Account
              </Button>
              <span className="ml-2 mr-2 mt-2" id="google">
                Or
              </span>
              <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={failureGoogle}
                cookiePolicy={"single_host_origin"}
                style={{ fontSize: "0.8rem" }}
              >
                Signup With Google{" "}
              </GoogleLogin>
            </Text>
            <div className="register-msg">
              <small>
                Already have an account?{" "}
                <Link href="/customer/login">
                  <a>Login</a>
                </Link>{" "}
              </small>
            </div>
          </div>
        </form>
        <style jsx>{`
          .register-page-wrap {
            display: flex;
            flex-direction: column-reverse;
            margin: 1rem auto;
            width: 90%;
          }
          form {
            margin: 1rem auto;
            width: 90%;
          }

          .register {
            text-align: center;
            font-size: 1.5rem;
            font-weight: bolder;
            color: var(--deepblue);
          }
          .register-message {
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
          .register-msg a {
            color: var(--deepblue);
          }
          .register-vector {
            display: none;
          }
          @media only screen and (min-width: 700px) {
            .register-page-wrap {
              flex-direction: row;
              width: 80%;
              margin: 2rem auto;
            }
            form {
              margin: 2rem auto;
            }
            .register-vector {
              width: 50%;
              margin-right: 50px;
              display: block;
            }
          }

          @media only screen and (min-width: 1400px) {
            .register-page-wrap {
              width: 70%;
            }
          }
          @media only screen and (min-width: 1800px) {
            .register-page-wrap {
              width: 60%;
              margin: 100px auto;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Register;
