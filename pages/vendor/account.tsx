import { Button, Icon, Input, Textarea, useToast } from "@chakra-ui/core";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/vendor/Navigation";
import { useToken } from "../../Context/TokenProvider";
import { useUser } from "../../Context/UserProvider";
import { MutationUpdateProfileArgs } from "../../Typescript/types";
import { useMutation } from "../../utils/useMutation";
import { ProtectRouteV } from "./../../utils/ProtectedRouteV";
import { useRouter } from "next/router";

export const Account = () => {
  const { User } = useUser();
  const { Token } = useToken();
  const router = useRouter();
  const toast = useToast();
  const tempImage = `/slider/service.jpg`;

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setPhone(User.phone || "");
    setAddress(User.business_address || "");
    setAbout(User.business_bio || "");
    setImage(User.business_image || "");
  }, [User]);

  const updateProfile = `
  mutation updateProfile($first_name:String,$last_name:String,$business_name:String,$phone:String,
    $business_address: String,
    $business_image: String,
    $business_bio: String  ){
    updateProfile(first_name:$first_name,last_name:$last_name, business_name:$business_name,phone:$phone,business_address: $business_address,
      business_image: $business_image,
      business_bio: $business_bio ){
      message
    }
  }
  `;
  async function updateAccount(e) {
    e.preventDefault();
    const variables: MutationUpdateProfileArgs = {
      first_name: User.first_name,
      last_name: User.last_name,
      business_name: User.business_name,
      phone,
      business_address: address,
      business_image: image,
      business_bio: about,
    };

    const { data, error } = await useMutation(updateProfile, variables, Token);

    if (data) {
      toast({
        title: "Account Updated Successfully",
        status: "info",
      });
      setEditMode(false);
      router.reload();
    }
    if (error) {
      toast({
        title: "Failed To Update Your Account",
        description: "Check Your Internet Connection and Refresh",
        status: "error",
        isClosable: true,
      });
    }
  }

  return (
    <div>
      <Head>
        <title>
          {User && User.business_name} Account | {User && User.first_name} |
          Vendor | PartyStore
        </title>
      </Head>
      <div className="account-layout">
        <div>
          <Navigation />
        </div>
        <main>
          <aside>
            <form onSubmit={updateAccount}>
              <section className="account-head">
                <h1>Account Information</h1>
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
                  <img src={`${tempImage}`} alt="store image" />
                  <br />
                  <span style={{ display: editMode ? "block" : "none" }}>
                    <Input
                      type="file"
                      name="upload store image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    ></Input>
                  </span>
                </div>

                <div className="account-item">
                  <h2>
                    About Store{" "}
                    <small
                      style={{
                        display: editMode ? "block" : "none",
                      }}
                    >
                      *This will be displayed on your public store page
                    </small>
                  </h2>
                  <p>
                    {(User && User.business_bio) ||
                      "We seek to provide quality product and service to our customers. At " +
                        User.business_name +
                        ", customers come first"}
                  </p>
                  <br />
                  <span style={{ display: editMode ? "block" : "none" }}>
                    <Textarea
                      name="about"
                      id="about"
                      value={about}
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
                      isRequired
                      type="tel"
                      placeholder="enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    ></Input>
                  </span>
                </div>
              </div>
              {editMode && (
                <Button
                  type="submit"
                  size="sm"
                  style={{
                    background: "var(--deepblue)",
                    color: "white",
                  }}
                >
                  Update
                </Button>
              )}
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
          justify-content: space-around;
          margin-top: 20px;
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
          .account-item h2 {
            font-size: 1rem;
          }
        }
        @media only screen and (min-width: 1800px) {
          .account-layout aside {
            width: 67%;
          }
          .account-item img {
            width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProtectRouteV(Account);
