import React, { useEffect, useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  InputLeftAddon,
  Icon,
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import { graphQLClient } from "../../utils/client";
import { useRouter } from "next/router";
import { LOG_IN } from "../../graphql/users";
import { useToken } from "../../Context/TokenProvider";
import { LoginRes, MutationLogInArgs } from "../../Typescript/types";
import Link from "next/link";
import { Layout } from "../../components/Layout";

export const Login = () => {
  //from context
  const { setToken } = useToken();

  const router = useRouter();
  //react-hook-form
  const { handleSubmit, register, errors } = useForm();

  //show password or not in input field- password/confirm password
  const [show, setShow] = useState(false);
  //custom error, mostly from the server
  const [customError, setCustomError] = useState("");
  const [Loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (customError || success) {
      setTimeout(() => {
        setCustomError("");
        setSuccess("");
      }, 5000);
    }
  }, [customError]);

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

      if (data) {
        setLoading(false);
        setToken(data.accesstoken);
        if (data.role !== "vendor") {
          router.push(`/${data.role}/login`);
          return;
        }
        setSuccess("Login Successful");
        router.push("/vendor/dashboard");
      }
    } catch (err) {
      // console.log(err.message);
      setCustomError(err.response?.errors[0].message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="log-in">Log In</h1>
          <h2 className="log-in-message">Let's Make Sales Today!</h2>
          <h3 style={{ color: "red" }}>{customError}</h3>
          <h3 style={{ color: "green" }}>{success}</h3>
          <FormControl isRequired>
            <div>
              <FormLabel htmlFor="email">Email</FormLabel>
              <InputGroup>
                {/* <InputLeftAddon
                  children={<Icon name="at-sign" color="blue.400" />}
                /> */}
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
                  isInvalid={errors.email || customError ? true : false}
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
                  isInvalid={customError ? true : false}
                  errorBorderColor="red.300"
                />
                <InputRightElement width="4.5rem">
                  {/* <InputLeftAddon
                  children={<Icon name="view" color="blue.400" />}
                  borderTop="none"
                  color="blue.400"
                /> */}
                  <Icon
                    name="view"
                    color="blue.400"
                    cursor="pointer"
                    onClick={() => {
                      setShow(!show);
                    }}
                  />
                  {/* <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                      setShow(!show);
                    }}
                  >
                    {show ? "Hide" : "Show"}
                  </Button> */}
                </InputRightElement>
              </InputGroup>
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
            text-align: center;
            margin-top: 10px;
          }
          .sign-up-msg a {
            color: var(--deepblue);
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Login;
