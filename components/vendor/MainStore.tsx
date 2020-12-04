import { Icon, useToast } from "@chakra-ui/core";
import { gql } from "graphql-request";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useToken } from "../../Context/TokenProvider";
import { MutationDeleteProductArgs, UsersRes } from "../../Typescript/types";
import { Commas } from "../../utils/helpers";
import { useMutation } from "../../utils/useMutation";

interface StoreProps {
  user: UsersRes;
  // handleDelete: (id: string, creator_id: string, name: string) => void;
}
export const MainStore: React.FC<StoreProps> = ({ user }) => {
  const router = useRouter();
  //from context
  const { Token } = useToken();

  const toast = useToast();

  // Delete Product
  const handleDelete = async (id, creator_id, name) => {
    const variables: MutationDeleteProductArgs = {
      id,
      creator_id,
    };

    const deleteProduct = gql`
      mutation deleteProduct($id: ID!, $creator_id: String!) {
        deleteProduct(id: $id, creator_id: $creator_id) {
          message
        }
      }
    `;

    if (
      window.confirm(`Are you sure you want to Delete This Product : ${name} ?`)
    ) {
      const { data, error } = await useMutation(
        deleteProduct,
        variables,
        Token
      );

      if (data) {
        toast({
          title: "Your Product Has Been Deleted",
          status: "success",
          duration: 5000,
        });
        router.reload();
      }
      if (error) {
        toast({
          title: "An Error Ocurred",
          description: error.response?.errors[0].message
            ? error.response?.errors[0].message
            : "An error occurred, check your internet connection",
          status: "error",
        });
      }
    }
  };

  return (
    <section className="main-store">
      <header>
        <div>
          <div className="store-name" style={{ display: "flex" }}>
            <img src="/home-alt.svg" alt="profile" className="mr-1" />{" "}
            <span>{user.business_name}</span>
          </div>
          <div className="store-bio">
            <img src="/notes.svg" alt="profile" />{" "}
            {user.business_bio ||
              "We seek to provide quality products and services to our customers. At " +
                user.business_name +
                ", customers come first"}
          </div>
          <div className="store-location">
            <Icon name="phone" mr="10px" />
            {user.phone || "080123456789"}
          </div>
        </div>
        {/* ONLY SHOW EDIT BUTTON TO STORE OWNER */}
        <div>
          {user && user.id === user.jwt_user_id ? (
            <div className="edit-btn">
              <button
                aria-label="edit account"
                title="edit account"
                style={{
                  color: "var(--deepblue)",
                  fontWeight: "bold",
                }}
              >
                <Link href="/vendor/account">
                  <a>
                    <Icon name="edit" />
                  </a>
                </Link>
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </header>
      <hr />

      <div className="store-products">
        <div className="store-products_head">
          <h1>{user && user.usersProducts.length} Products In Store</h1>
        </div>

        {/* IF NO PRODUCT IN STORE */}
        <div>
          {user && user.usersProducts.length === 0 && (
            <div>
              {/* MESSAGE FOR STORE OWNER */}
              {user.id === user.jwt_user_id ? (
                <div
                  className="status"
                  style={{ color: "black", background: "white" }}
                >
                  Your Store is empty, Add a new product,{" "}
                  <Link href="/store/new-item">
                    <a style={{ color: "var(--deepblue)" }}>Click Here</a>
                  </Link>
                </div>
              ) : (
                <p className="space"></p>
              )}
            </div>
          )}
        </div>

        {/* STORE PRODUCTS  */}

        <div className="store-products_wrap">
          {user &&
            user.usersProducts.map((p, index) => (
              <div className="store-item" key={p.id}>
                {/* Inventory status , visible only to store owner (user.id === user.jwt_user_id) */}
                {user && user.id === user.jwt_user_id ? (
                  <div className="product-status pl-3">
                    {p.available_qty === 0 || p.in_stock === "false" ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Out of stock!!
                      </span>
                    ) : (
                      `${p.available_qty} in stock`
                    )}
                  </div>
                ) : (
                  ""
                )}

                <Link
                  href={`/product/${p.name_slug}`}
                  as={`/product/${p.name_slug}`}
                >
                  <a>
                    <img src={p.images[0]} alt={`${p.name}`} loading="lazy" />
                    <hr />
                    <div className="store-desc">
                      <h2>{p.name}</h2>
                      <p>&#8358; {Commas(p.price)}</p>
                    </div>
                  </a>
                </Link>
                {/* ONLY SHOW PRODUCT EDIT BUTTON TO STORE OWNER */}

                {user && user.id === user.jwt_user_id ? (
                  <div className="edit-btn">
                    <button
                      title="edit product"
                      style={{
                        color: "var(--deepblue)",
                        fontWeight: "bold",
                      }}
                    >
                      <Link href={`/store/edit/${p.id}`}>
                        <a>Edit</a>
                      </Link>
                    </button>
                    <button
                      title="delete product"
                      onClick={() => handleDelete(p.id, p.creator_id, p.name)}
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
