import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/core";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Footer } from "../../../components/Footer";
import { Navigation } from "../../../components/vendor/Navigation";
import { useToken } from "../../../Context/TokenProvider";
import { editProductPage, updateProduct } from "../../../graphql/vendor";
import {
  ProductsRes,
  MutationUpdateProductArgs,
} from "../../../Typescript/types";
import { graphQLClient } from "../../../utils/client";
import { ProtectRouteV } from "../../../utils/ProtectedRouteV";
import { useMutation } from "../../../utils/useMutation";
import Upload from "rc-upload";
import { restLinks } from "./../../../utils/client";

interface Iprops {
  product: ProductsRes;
  error: any;
}

export async function getServerSideProps({ params }) {
  const variables = {
    id: params.id,
  };

  try {
    const res = await graphQLClient.request(editProductPage, variables);
    const product = res.editProductPage;
    return {
      props: {
        product,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err?.response?.errors[0].message || err.message,
      },
    };
  }
}

const Edit = ({ product, error }: Iprops) => {
  const toast = useToast();
  const router = useRouter();
  //from context
  const { Token } = useToken();
  //role from cookie
  let role = Cookies.get("role");

  const [Loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [partyCategory, setPartyCategory] = useState("");
  const [inStock, setInStock] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<any>("");
  const [available_qty, setAvailableQty] = useState<any>("");
  const [image, setImage] = useState("");
  const [imageLoad, setImageLoad] = useState(false);

  //Image Upload Library
  const uploaderProps = {
    action: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(restLinks[1]);
        }, 2000);
      });
    },
    onSuccess(ImageLink) {
      setImage(ImageLink);
      setImageLoad(false);
      if (ImageLink["error"]) {
        toast({
          title: "Error Uploading Image",
          description: "Check Your Internet Connection and Try Again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onProgress(step, file) {
      setImageLoad(true);
    },
    onError(err) {
      setImageLoad(false);
    },
  };

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setAvailableQty(product.available_qty || "");
      setCategory(product.category || "");
      setPartyCategory(product.party_category || "");
      setInStock(product.in_stock || "");
      setImage(product.image || "");
    }
  }, [product]);

  // form submit
  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault();

    if (name.trim() === "" || description.trim() === "") {
      toast({
        title: "All Fields Are Required",
        status: "info",
        duration: 3000,
      });
      return;
    }
    if (!category || !partyCategory) {
      toast({
        title: "Category  Must Be Selected",
        status: "info",
        duration: 3000,
      });
      return;
    }
    if (!image) {
      toast({
        title: "Please Upload an Image of Your Product",
        description: "White Background Preferably",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const variables: MutationUpdateProductArgs = {
      id: product.id,
      creator_id: product.creator_id,
      name: name.trim(),
      description,
      price: parseInt(price),
      category,
      party_category: partyCategory,
      image,
      in_stock: inStock,
      available_qty: parseInt(available_qty),
    };

    setLoading(true);

    const { data, error } = await useMutation(updateProduct, variables, Token);

    if (data) {
      setLoading(false);
      toast({
        title: "Your Product Has Been Successfuly Updated",
        status: "success",
        duration: 5000,
      });
      router.push(`/product/${product.name_slug}`);
    }
    if (error) {
      setLoading(false);
      toast({
        title: "An Error Ocurred",
        description: error.response?.errors[0].message
          ? error.response?.errors[0].message
          : "An error occurred, check your internet connection",
        status: "error",
      });
    }
  };

  return (
    <div>
      <Head>
        <title>Edit Product | Vendor | PartyStore</title>
      </Head>
      <>
        {error ||
          (!product &&
            toast({
              title: "An Error Ocurred",
              description: "Check Your Internet Connection",
              status: "error",
              duration: 3000,
              position: "top",
            }))}
      </>

      <div className="new-item-layout">
        <div>
          <Navigation />
        </div>
        <main>
          <div className="store_new-item">
            {role && role !== "vendor" && (
              <div className="indicator">
                You Are Not Logged In. Redirecting...
              </div>
            )}
            {role && role === "vendor" && (
              <div className="main-wrap">
                <h1 className="title">Add A New Product</h1>
                <form onSubmit={handleSubmit}>
                  <FormControl isRequired>
                    <div className="form-wrap">
                      <section className="grid-1">
                        <div className="form-item">
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="description">
                            Description
                          </FormLabel>
                          <Textarea
                            id="description"
                            name="description"
                            aria-describedby="descriptiom-helper-text"
                            placeholder="Help your customers know all about this product."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          ></Textarea>
                        </div>
                      </section>

                      <section className="grid-2">
                        <div className="form-item">
                          <FormLabel htmlFor="price">Price</FormLabel>
                          <InputGroup>
                            <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              name="price"
                              id="price"
                              placeholder="Product Price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              errorBorderColor="red.300"
                            />
                          </InputGroup>
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="category">
                            Product Category
                          </FormLabel>
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
                          <FormLabel htmlFor="category">
                            Party Category
                          </FormLabel>
                          <Select
                            defaultValue={partyCategory}
                            onChange={(e) => {
                              setPartyCategory(e.target.value);
                            }}
                          >
                            <option defaultValue="">--select--</option>
                            <option defaultValue="Birthday Party">
                              Birthday Party
                            </option>
                            <option defaultValue="Beach Party">
                              Beach Party
                            </option>
                            <option defaultValue="House Party">
                              House Party
                            </option>
                            <option defaultValue="Social Clubs">
                              Social Clubs
                            </option>
                            <option defaultValue="Outdoors">Outdoors</option>
                            <option defaultValue="Indoors">Indoors</option>
                          </Select>
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="available quantity">
                            Available Quantity In Stock
                          </FormLabel>
                          <InputGroup>
                            <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              name="available_qty"
                              id="available quantity"
                              placeholder="number of items in stock"
                              maxLength={3}
                              width="15"
                              value={available_qty}
                              onChange={(e) => setAvailableQty(e.target.value)}
                              errorBorderColor="red.300"
                            />
                          </InputGroup>
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="In Stock">
                            Is Product In Stock
                          </FormLabel>
                          <RadioGroup
                            spacing={5}
                            isInline
                            value={inStock}
                            onChange={(e: any) => setInStock(e.target.value)}
                          >
                            <Radio name="inStock" value="true">
                              In Stock
                            </Radio>
                            <Radio name="inStock" value="false">
                              Out Of Stock
                            </Radio>
                          </RadioGroup>
                        </div>

                        <div className="form-item image-upload">
                          <Upload {...uploaderProps} id="test">
                            {imageLoad ? (
                              <Spinner speed="0.7s"></Spinner>
                            ) : image ? null : (
                              <div>
                                <a>
                                  Click or Drag Here to Update Product Image.
                                  White Background Preferably
                                </a>
                                <img src="/upload-icon.png" />
                              </div>
                            )}
                            <p>{image && "Click to Edit"}</p>
                            <img src={`${image}`} />
                          </Upload>
                        </div>
                      </section>
                    </div>
                  </FormControl>

                  <br />
                  <div className="btn">
                    <Button
                      isDisabled={Loading}
                      style={{ background: "var(--deepblue)", color: "white" }}
                      type="submit"
                      isLoading={Loading}
                    >
                      Update Product
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />

      <style jsx>{`
        .form-item.image-upload {
          box-shadow: var(--box) var(--softgrey);
          padding: 10px;
        }
        .image-upload a {
          font-size: 0.9rem;
        }

        .image-upload div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default ProtectRouteV(Edit);
