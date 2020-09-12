import React, { useEffect } from "react";
import { STORE } from "../../graphql/vendor";
import { useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { UsersRes } from "../../Typescript/types";
import { useQuery } from "./../../components/useQuery";
import { useToken } from "../../Context/TokenProvider";

export function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  };
}
const Store = ({ id }) => {
  const toast = useToast();
  const router = useRouter();
  const { Token } = useToken();

  const variables = {
    business_name_slug: id,
  };
  const [data, loading, error] = useQuery(STORE, variables, Token);
  const res: UsersRes | undefined = data ? data.user : undefined;

  useEffect(() => {
    if (res && !res.id) {
      router.push("/404");
    }
  }, [res]);

  return (
    <div>
      {error &&
        toast({
          title: "An error occurred.",
          description: "check your internet connection and refresh.",
          status: "error",
          duration: 7000,
          isClosable: true,
          position: "top",
        })}
      {loading && "loading..."}
      <section>
        {res && (
          <ul>
            <li>{res.id}</li>
            <li>JWT ID: {res.jwt_user_id}</li>
            <li>{res.email}</li>
            <li>{res.role}</li>
            <li>{res.phone}</li>
            <li>{res.pending}</li>
            <li>{res.business_name}</li>
            <li>{res.business_address}</li>
            <li>{res.business_area}</li>
            <li>{res.business_image}</li>
            <li>{res.business_bio}</li>
          </ul>
        )}
      </section>
      <br />
      <section>
        {res &&
          res.usersProducts.map((d) => (
            <div key={d.id}>
              <div>{d.name}</div>
              <div>{d.name_slug}</div>
              <div>{d.price}</div>
              <div>{d.in_stock}</div>
              <div>{d.image}</div>
              <div>{d.category}</div>
              <div>{d.description}</div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default Store;
