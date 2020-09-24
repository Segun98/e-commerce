import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Spinner,
  useToast,
  InputGroup,
  InputLeftAddon,
  Stack,
} from "@chakra-ui/core";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slug from "slug";
import { useToken } from "../../Context/TokenProvider";
import { MutationAddProductArgs } from "../../Typescript/types";
import { ADD_PRODUCT } from "../../graphql/vendor";
import { ProtectRouteV } from "../../utils/ProtectedRouteV";
import { useMutation } from "../../utils/useMutation";

export const Newitem = () => {
  const toast = useToast();
  //from context
  const { Token } = useToken();
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
  const { handleSubmit, register, errors, watch } = useForm();

  const [category, setCategory] = useState("");

  const onSubmit = async (values, e): Promise<void> => {
    e.preventDefault();

    const { name, description, price, available_qty } = values;

    if (name.trim() === "" || description.trim() === "") {
      setCustomError("All Fields are Required");
      return;
    }

    const variables: MutationAddProductArgs = {
      name: name.trim(),
      name_slug: slug(name),
      description,
      price: parseInt(price),
      category: category === "" ? "other" : category,
      image: "unsplash.com",
      available_qty: parseInt(available_qty),
    };

    setLoading(true);

    const { data, error } = await useMutation(ADD_PRODUCT, variables, Token);

    if (data) {
      setLoading(false);
      setSuccess(data.addProduct.message);
      toast({
        title: "Your Product Has Been Successfuly Added",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      e.target.reset();
    }
    if (error) {
      setLoading(false);
      setCustomError(
        error.response?.errors[0].message
          ? error.response?.errors[0].message
          : "An error occurred, check your intenet connection"
      );
      toast({
        title: "An Error Ocuurred",
        description: error.response?.errors[0].message
          ? error.response?.errors[0].message
          : "An error occurred, check your intenet connection",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      // console.log(error?.message);
      // console.log(error.response?.errors[0].message);
    }
  };

  return (
    <div className="store_new-item">
      {role && role !== "vendor" && (
        <div className="indicator">You Are Not Logged In. Redirecting...</div>
      )}
      {role && role === "vendor" && (
        <div className="main-wrap">
          <h1 className="title">Add A New Product</h1>
          <h3 style={{ color: "red" }}>{customError}</h3>
          <h3 style={{ color: "green" }}>{success}</h3>
          <br />
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired>
              <div className="form-wrap">
                <section className="grid-1">
                  <div className="form-item">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      aria-describedby="name-helper-text"
                      placeholder="Product Name"
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

                  <div className="form-item">
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea
                      id="description"
                      name="description"
                      aria-describedby="descriptiom-helper-text"
                      placeholder="Help your customers know all about this product."
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
                </section>

                <section className="grid-2">
                  <div className="form-item">
                    <FormLabel htmlFor="price">Price</FormLabel>
                    <InputGroup>
                      <InputLeftAddon
                        children="&#8358;"
                        color="blue.400"
                        fontSize="0.8em"
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="price"
                        id="price"
                        placeholder="Product Price"
                        ref={register({
                          required: true,
                        })}
                        isInvalid={errors.price ? true : false}
                        errorBorderColor="red.300"
                      />
                    </InputGroup>
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
                      <option defaultValue="Games">Games</option>
                      <option defaultValue="Drinks">Drinks</option>
                      <option defaultValue="Drinks">Decorations</option>
                      <option defaultValue="Food">Gifts</option>
                      <option defaultValue="Props">Props</option>
                      <option defaultValue="Other">Other</option>
                    </Select>
                  </div>

                  <div className="form-item">
                    <FormLabel htmlFor="available quantity">
                      Available Quantity In Stock
                    </FormLabel>
                    <InputGroup>
                      <InputLeftAddon
                        children="Qty"
                        color="blue.400"
                        fontSize="0.8em"
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="available_qty"
                        id="available quantity"
                        placeholder="number of items in stock"
                        defaultValue="1"
                        maxLength={3}
                        width="15"
                        ref={register({
                          required: true,
                        })}
                        isInvalid={errors.available_qty ? true : false}
                        errorBorderColor="red.300"
                      />
                    </InputGroup>
                  </div>
                </section>
              </div>
            </FormControl>

            <br />
            <div className="btn">
              <Button
                isDisabled={Loading}
                variantColor="blue"
                type="submit"
                isLoading={Loading}
              >
                Add Product
              </Button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{``}</style>
    </div>
  );
};

export default ProtectRouteV(Newitem);
