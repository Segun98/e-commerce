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
import { request } from "graphql-request";
import { SIGN_UP } from "@/graphql/users";
import { endpoint } from "@/utils/client";
import { useRouter } from "next/router";
import slug from "slug";
import { MutationSignUpArgs } from "@/Typescript/types";
import { Layout } from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";

export const Register = () => {
  const router = useRouter();
  const toast = useToast();
  //react-hook-form
  const { handleSubmit, register, errors, watch } = useForm();

  //show password or not in input field- password/confirm password
  const [show, setShow] = useState(false);
  //custom error, mostly from the server
  const [Loading, setLoading] = useState(false);

  //helper to convert the first letters of business name to capital letter
  function capital_letter(str: string | any) {
    let tit = str.trim().replace(/\s+/g, " ");
    tit = tit.split(" ");

    for (var i = 0, x = tit.length; i < x; i++) {
      tit[i] = tit[i][0].toUpperCase() + tit[i].substr(1);
    }
    return tit.join(" ");
  }

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
    const {
      business_name,
      first_name,
      last_name,
      email,
      password,
      confirm_password,
    } = values;

    if (
      first_name.trim() === "" ||
      last_name.trim() === "" ||
      business_name.trim() === ""
    ) {
      toast({
        title: "All Fields Are Required",
        status: "info",
        duration: 3000,
      });
      return;
    }

    const variables: MutationSignUpArgs = {
      business_name: capital_letter(business_name),
      business_name_slug: slug(business_name),
      first_name,
      last_name,
      email: email.toLowerCase(),
      password,
      confirm_password,
      role: "vendor",
      //pending status of vendor account
      pending: "true",
    };

    try {
      setLoading(true);
      const res = await request(endpoint, SIGN_UP, variables);

      if (res.signUp) {
        setLoading(false);
        toast({
          title: "Sign Up Successful!",
          description: "Redirecting to Login",
          status: "success",
          duration: 3000,
        });
        router.push("/vendor/login");
      }
    } catch (err) {
      setLoading(false);
      if (err.message === "Network request failed") {
        toast({
          title: "Oops, Network Request Failed",
          description: "Please Check Your Internet Connection and Try Again",
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

  return (
    <Layout>
      <Head>
        <title>Vendor Register | PartyStore</title>
      </Head>
      <div className="register-page-wrap">
        <img
          src="/undraw_receipt_ecdd.svg"
          alt="register vector"
          className="register-vector"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="register mb-2">Create Account</h1>
          <h2 className="register-message">
            Start Making Sales and Transform Your Business
          </h2>
          <FormControl isRequired>
            <div>
              <FormLabel htmlFor="business_name">Business Name</FormLabel>
              <Input
                type="text"
                id="business_name"
                name="business_name"
                aria-describedby="business_name-helper-text"
                placeholder="Business Name"
                ref={register({
                  required: true,
                  minLength: 3,
                })}
                isInvalid={errors.business_name ? true : false}
                errorBorderColor="red.300"
              />
              <small style={{ color: "red" }}>
                {errors.business_name &&
                  "Business name should be a minimum of 3 chracters"}
              </small>
            </div>

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
            <Button
              isDisabled={Loading}
              style={{ background: "var(--deepblue)", color: "white" }}
              type="submit"
              isLoading={Loading}
            >
              Submit
            </Button>
          </div>
          <div className="register-message">
            <small>
              Already have an account?{" "}
              <Link href="/vendor/login">
                <a>Login</a>
              </Link>{" "}
            </small>
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
            /* color: var(--softgrey); */
            margin-bottom: 5px;
            padding: 5px 0;
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
          .register-message a {
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
          @media only screen and (min-width: 2000px) {
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
