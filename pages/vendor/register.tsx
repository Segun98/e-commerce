import React, { useEffect, useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  InputGroup,
  InputRightElement,
  Button,
  InputLeftAddon,
  Icon,
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import { request } from "graphql-request";
import { SIGN_UP } from "./../../graphql/users";
import { endpoint } from "../../utils/client";
import { useRouter } from "next/router";
import slug from "slug";
import { MutationSignUpArgs } from "../../Typescript/types";

export const Register = () => {
  const router = useRouter();
  //react-hook-form
  const { handleSubmit, register, errors, watch } = useForm();

  //show password or not in input field- password/confirm password
  const [show, setShow] = useState(false);
  //custom error, mostly from the server
  const [customError, setCustomError] = useState("");
  const [Loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (customError) {
      setTimeout(() => {
        setCustomError("");
      }, 5000);
    }
  }, [customError]);

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
      return setCustomError("Passwords must match");
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
      setCustomError("All Fields are Required");
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
      //I'm using one mutation for admin, customers and vendors so some of these have to be here
      customer_address: null,
      phone: null,
      business_address: null,
      business_area: null,
      business_image: null,
      business_bio: null,
    };

    try {
      setLoading(true);
      const res = await request(endpoint, SIGN_UP, variables);

      if (res.signUp) {
        setLoading(false);
        setSuccess(res.signUp.message);
        //reset form field
        e.target.reset();
        router.push("/vendor/login");
      }
    } catch (err) {
      setCustomError(err.response?.errors[0].message);
      setLoading(false);
      // console.log(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Register as a Vendor</h2>
        <h3 style={{ color: "red" }}>{customError}</h3>
        <h3 style={{ color: "green" }}>{success}</h3>
        <FormControl isRequired>
          <div>
            <FormLabel htmlFor="business_name">Business Name</FormLabel>
            <Input
              type="business_name"
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
              type="first_name"
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
              type="last_name"
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
              <InputLeftAddon
                children={<Icon name="at-sign" color="blue.400" />}
              />
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
            <FormHelperText id="email-helper-text" color="green">
              We'll never share your email.
            </FormHelperText>
          </div>

          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup size="md">
              <InputLeftAddon
                children={<Icon name="view" color="blue.400" />}
                borderTop="none"
                color="blue.400"
              />
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
            <small style={{ color: "red" }}>
              {errors.password && "minimum of 8 characters and max of 20"}
            </small>
          </div>

          <div>
            <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
            <InputGroup size="md">
              <InputLeftAddon
                children={<Icon name="view" color="blue.400" />}
                borderTop="none"
                color="blue.400"
              />
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
          Submit
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

export default Register;
