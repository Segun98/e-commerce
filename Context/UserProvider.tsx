import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { graphQLClient } from "@/utils/client";
import { useToken } from "./TokenProvider";
import { UsersRes } from "@/Typescript/types";
import { gql } from "graphql-request";
import Cookies from "js-cookie";
interface props {
  User: UsersRes;
  setUser: Dispatch<SetStateAction<any>>;
  userDependency: boolean;
  setUserDependency: Dispatch<SetStateAction<boolean>>;
}

export const UserContext = createContext<props>(undefined);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [User, setUser] = useState<UsersRes>({});

  //to refetch "fetchUser()" effect on user update
  const [userDependency, setUserDependency] = useState(false);
  const { Token } = useToken();

  useEffect(() => {
    fetchUser();
  }, [Token, userDependency]);

  const getUser = gql`
    query getUser {
      getUser {
        first_name
        last_name
        email
        phone
        pending
        online
        created_at
        business_name
        business_name_slug
        business_address
        business_image
        business_bio
        customer_address
      }
    }
  `;
  async function fetchUser() {
    if (!Cookies.get("ecom")) {
      return;
    }
    graphQLClient.setHeader("authorization", `bearer ${Token}`);
    try {
      const res = await graphQLClient.request(getUser);
      const data = res.getUser;
      if (data) {
        setUser(data);
      }
    } catch (err) {
      // console.log(err.response?.errors[0].message);
    }
  }

  return (
    <UserContext.Provider
      value={{ User, setUser, userDependency, setUserDependency }}
    >
      {children}
    </UserContext.Provider>
  );
};
