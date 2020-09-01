import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Spinner,
} from "@chakra-ui/core";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slug from "slug";
import { useAuth } from "../../Context/AuthProvider";
import { graphQLClient } from "../../utils/client";
import { ADD_PRODUCT } from "./../../graphql/vendor";
import { ProtectRouteV } from "./../../utils/ProtectedRouteV";

interface input {
  name: string;
  name_slug: string;
  description: string;
  price: any;
  category: string;
  image: string;
  in_stock: string;
}

export const Newitem = () => {
  //from context
  const { Token } = useAuth();
  //role from cookie
  let role = Cookies.get("role");

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

  //input states
  const { handleSubmit, register, errors } = useForm();
  const [category, setCategory] = useState("");

  const onSubmit = async (values: input, e): Promise<void> => {
    e.preventDefault();
    const { name, description, price } = values;

    const variables: input = {
      name,
      name_slug: slug(name),
      description,
      price: parseInt(price),
      category: category === "" ? "other" : category,
      image: "unsplash.com",
      in_stock: "true",
    };

    try {
      graphQLClient.setHeader("authorization", `Bearer ${Token}`);
      setLoading(true);
      const res = await graphQLClient.request(ADD_PRODUCT, variables);
      if (res.addProduct) {
        setLoading(false);
        setSuccess(res.addProduct.message);
        e.target.reset();
      }
    } catch (err) {
      console.log(err?.message);
      console.log(err.response?.errors[0].message);
      setCustomError("an error occurred, check your intenet connection");
      setLoading(false);
    }
  };
  return (
    <div>
      <>
        {role && role !== "vendor" ? (
          <div className="indicator">
            <Spinner speed="1s"></Spinner>
          </div>
        ) : null}
      </>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>New Product</h2>
        <h3 style={{ color: "red" }}>{customError}</h3>
        <h3 style={{ color: "green" }}>{success}</h3>
        <FormControl isRequired>
          <div>
            <FormLabel htmlFor="name">Product Name</FormLabel>
            <Input
              type="text"
              id="name"
              name="name"
              aria-describedby="name-helper-text"
              placeholder="name@example.com"
              ref={register({
                required: true,
                minLength: 3,
              })}
              isInvalid={errors.name ? true : false}
              errorBorderColor="red.300"
            />
            <small style={{ color: "red" }}>
              {errors.name && errors.name.message}
            </small>
          </div>

          <div>
            <FormLabel htmlFor="description">Product Description</FormLabel>
            <Textarea
              //   size="sm"
              id="description"
              name="description"
              aria-describedby="descriptiom-helper-text"
              placeholder="help your customers know more about this product"
              ref={register({
                required: true,
                minLength: 10,
              })}
              isInvalid={errors.description ? true : false}
              errorBorderColor="red.300"
            ></Textarea>
            <small style={{ color: "red" }}>
              {errors.description && "minimum length of 10 characters"}
            </small>
          </div>

          <div>
            <FormLabel htmlFor="price">Price</FormLabel>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="price"
              id="price"
              ref={register({
                required: true,
              })}
              isInvalid={errors.price ? true : false}
              errorBorderColor="red.300"
            />
          </div>

          <div className="form-item">
            <FormLabel htmlFor="category">Product Category</FormLabel>

            <Select
              defaultValue={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option defaultValue="">--select--</option>
              <option defaultValue="Cakes">Cakes</option>
              <option defaultValue="Props">Props</option>
              <option defaultValue="Drinks">Drinks</option>
              <option defaultValue="Food">Food</option>
              <option defaultValue="Other">Other</option>
            </Select>
          </div>
        </FormControl>

        <Button
          isDisabled={Loading}
          // variantColor="purple"
          type="submit"
          isLoading={Loading}
        >
          Add Product
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

export default ProtectRouteV(Newitem);
