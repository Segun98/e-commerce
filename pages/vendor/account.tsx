import {
  Button,
  FormLabel,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/core";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/vendor/Navigation";
import { useToken } from "@/Context/TokenProvider";
import { useUser } from "@/Context/UserProvider";
import { MutationUpdateProfileArgs } from "@/Typescript/types";
import { useMutation } from "@/utils/useMutation";
import { ProtectRouteV } from "@/utils/ProtectedRouteV";
import Upload from "rc-upload";
import { uploadLink } from "@/utils/client";
import { updateProfile } from "@/graphql/vendor";

export const Account = () => {
  const { User, userDependency, setUserDependency } = useUser();
  const { Token } = useToken();
  const toast = useToast();
  const tempImage = `/slider/service.jpg`;

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [online, setOnline] = useState("");

  useEffect(() => {
    setPhone(User.phone || "");
    setAddress(User.business_address || "");
    setAbout(User.business_bio || "");
    setImage(User.business_image || "");
    setOnline(User.online || "");
  }, [User]);

  const [imageLoad, setImageLoad] = useState(false);

  //image upload
  const uploaderProps = {
    action: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(uploadLink);
        }, 2000);
      });
    },
    onSuccess(ImageLink) {
      setImage(ImageLink);
      setImageLoad(false);
    },
    onProgress(step, file) {
      setImageLoad(true);
    },
    onError(err) {
      setImageLoad(false);
      toast({
        title: "Error Uploading Image",
        description: "Check Your Internet Connection and Try Again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  };

  async function updateAccount(e: React.SyntheticEvent<EventTarget>) {
    e.preventDefault();
    const variables: MutationUpdateProfileArgs = {
      first_name: User.first_name,
      last_name: User.last_name,
      business_name: User.business_name,
      phone,
      business_address: address,
      business_image: image,
      business_bio: about,
      online,
    };

    const { data, error } = await useMutation(updateProfile, variables, Token);

    if (data) {
      toast({
        title: "Account Updated Successfully",
        status: "info",
        position: "top",
        isClosable: true,
      });

      setEditMode(false);
      //update user in useEffect
      setUserDependency(!userDependency);
    }
    if (error) {
      toast({
        title: "Failed To Update Your Account",
        description: "Check Your Internet Connection and Refresh",
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  }

  //Parse Date
  function toDate(d) {
    if (User["created_at"]) {
      let date = new Date(parseInt(d));
      let format = new Intl.DateTimeFormat("en-us", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
      return format || date.toLocaleString();
    }
  }

  return (
    <div>
      <Head>
        <title>{User && User.business_name} Account | PartyStore</title>
      </Head>
      <div className="account-layout">
        <div>
          <Navigation />
        </div>
        <main>
          <aside>
            <form onSubmit={updateAccount}>
              <section className="account-head">
                <h1>Account</h1>

                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  style={{ color: "var(--deepblue)", fontWeight: "bold" }}
                >
                  Edit <Icon name="edit" />
                </button>
              </section>

              <div className="account-items">
                <div className="account-item">
                  <h2>
                    Store Image{" "}
                    <small
                      style={{
                        display: editMode ? "block" : "none",
                      }}
                    >
                      *This will be displayed in the public "Stores" Page
                    </small>
                  </h2>
                  <img
                    className="store-img"
                    src={`${image || tempImage}`}
                    alt="store image"
                  />
                  <br />
                  <span style={{ display: editMode ? "block" : "none" }}>
                    <div className="form-item image-upload">
                      {/* @ts-ignore */}
                      <Upload {...uploaderProps} id="test">
                        {imageLoad ? (
                          <Spinner speed="0.7s"></Spinner>
                        ) : image ? (
                          <div>
                            <h1>Click To Edit</h1>
                            <img src={`${image}`} />
                          </div>
                        ) : (
                          <div>
                            <a>Click or Drag to Upload Store Image</a>
                            <img src="/upload-icon.png" />
                          </div>
                        )}
                      </Upload>
                    </div>
                  </span>
                </div>

                <div className="account-item">
                  <h2>About Store </h2>
                  <p>
                    {(User && User.business_bio) ||
                      "We seek to provide quality product and service to our customers. At " +
                        User.business_name +
                        ", customers come first"}
                  </p>
                  <br />
                  <span style={{ display: editMode ? "block" : "none" }}>
                    <Textarea
                      aria-label="about"
                      name="about"
                      id="about"
                      value={about}
                      maxLength={250}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Enter your business bio"
                    >
                      {" "}
                    </Textarea>
                  </span>
                </div>
              </div>

              <hr />
              <div className="account-items">
                <div className="account-item">
                  <h2>Email</h2>
                  <p>{User.email}</p>
                </div>
                <div className="account-item">
                  <h2>Address</h2>
                  <p>
                    {User.business_address ||
                      `No5, My Business Address, Lagos.`}
                    <small
                      style={{
                        color: "var(--deepblue)",
                        display: editMode ? "block" : "none",
                      }}
                    >
                      *This is your Product's pick up address
                    </small>
                  </p>
                  <br />
                  <span style={{ display: editMode ? "block" : "none" }}>
                    <Input
                      aria-label="Address"
                      isRequired
                      type="text"
                      placeholder="enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    ></Input>
                  </span>
                  <br />
                  <h2>Phone</h2>
                  <p>{User.phone || `090 3000 4000 55`}</p>
                  <br />
                  <span style={{ display: editMode ? "block" : "none" }}>
                    <Input
                      aria-label="Phone"
                      isRequired
                      type="tel"
                      placeholder="enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    ></Input>
                  </span>

                  <div className="form-item">
                    <FormLabel htmlFor="online">
                      Your Status :{" "}
                      {User && online === "true" ? (
                        <span
                          style={{
                            color: "#32CD32",
                          }}
                        >
                          Online{" "}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "red",
                          }}
                        >
                          Offline
                        </span>
                      )}
                      <small
                        style={{
                          color: "var(--deepblue)",
                          display: editMode ? "block" : "none",
                        }}
                      >
                        *Going offline temporarily takes off your products from
                        the website, meaning you will recieve no Orders
                      </small>
                    </FormLabel>
                    {/* CANT SET STATUS IF YOU'RE PENDING  */}
                    <span
                      style={{
                        display:
                          editMode && User.pending === "false"
                            ? "block"
                            : "none",
                      }}
                    >
                      <RadioGroup
                        aria-label="online status"
                        spacing={5}
                        isInline
                        value={online}
                        onChange={(e: any) => setOnline(e.target.value)}
                      >
                        <Radio name="inStock" value="true">
                          online
                        </Radio>
                        <Radio name="inStock" value="false">
                          offline
                        </Radio>
                      </RadioGroup>
                    </span>
                  </div>
                </div>

                <span style={{ color: "var(--deepblue)", fontWeight: "bold" }}>
                  Vendor since {toDate(User.created_at)}
                </span>
                <br />
                {editMode && (
                  <Button
                    type="submit"
                    size="sm"
                    background="var(--deepblue)"
                    color="white"
                    display="block"
                  >
                    Update
                  </Button>
                )}
              </div>
              <br />
              <br />
            </form>
          </aside>
        </main>
      </div>
      <Footer />
      <style jsx>{`
        .account-layout {
          display: flex;
        }

        .account-layout aside {
          margin: auto;
          width: 97%;
        }

        .account-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin: 28px auto 0 auto;
          width: 80%;
        }

        .account-head h1 {
          color: var(--deepblue);
          font-weight: bold;
          font-size: 0.9rem;
        }

        .account-items {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 10px;
          padding: 20px;
        }
        .account-item img {
          width: 150px;
          height: 100px;
          margin-top: 5px;
        }

        .account-item h2 {
          color: var(--deepblue);
          font-weight: bold;
          font-size: 0.9rem;
          padding-bottom: 3px;
        }

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
        @media only screen and (min-width: 700px) {
          .account-item img {
            width: 250px;
          }
        }
        @media only screen and (min-width: 1000px) {
          .account-layout aside {
            margin-top: 36px;
            width: 87%;
          }
          .account-item img {
            width: 300px;
            height: 150px;
          }
        }
        @media only screen and (min-width: 1200px) {
          .account-head h1 {
            font-size: 1.1rem;
          }
          .account-item img {
            max-width: 80%;
            height: 200px;
          }
          .account-head {
            width: 100%;
          }
          .account-item h2 {
            font-size: 1rem;
          }
        }
        @media only screen and (min-width: 1800px) {
          .account-layout aside {
            width: 67%;
          }
          .account-item img {
            width: 1000px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProtectRouteV(Account);
