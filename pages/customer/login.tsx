import React, { useEffect, useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import { graphQLClient } from "../../utils/client";
import { useRouter } from "next/router";
import { LOG_IN } from "../../graphql/users";
import { LoginRes, MutationLogInArgs } from "../../Typescript/types";

export const Login = () => {
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
        if (data.role !== "customer") {
          setSuccess(
            "Credentials are correct but you are attempting login from the wrong portal"
          );
          router.push(`/${data.role}/login`);
          return;
        }
        setSuccess("Login Successful");
        //reset form field
        e.target.reset();
        router.push("/customer/account");
      }
    } catch (err) {
      // console.log(err.message);
      setCustomError(err.response?.errors[0].message);
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>LogIn to your Account</h2>
        <h3 style={{ color: "red" }}>{customError}</h3>
        <h3 style={{ color: "green" }}>{success}</h3>
        <FormControl isRequired>
          <div>
            <FormLabel htmlFor="email">Email address</FormLabel>
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
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
        </FormControl>

        <Button
          isDisabled={Loading}
          // variantColor="purple"
          type="submit"
          isLoading={Loading}
        >
          Log in
        </Button>
      </form>
      <style jsx>{`
        form {
          margin: auto;
          width: 60%;
          box-shadow: var(--box) var(--softgrey);
          padding: 20px;
          margin-top: 40px;
        }
        form h2:first-child {
          text-align: center;
          color: green;
        }

        form div {
          margin: 10px 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
