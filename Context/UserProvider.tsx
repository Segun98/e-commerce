import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { graphQLClient } from "../utils/client";
import { useToken } from "./TokenProvider";
import { UsersRes } from "../Typescript/types";

interface props {
  User: UsersRes;
  setUser: Dispatch<SetStateAction<any>>;
}

export const UserContext = createContext<props>(undefined);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [User, setUser] = useState<UsersRes>({});

  const { Token } = useToken();

  useEffect(() => {
    fetchUser();
  }, [Token]);

  const getUser = `
    query getUser{
      getUser{
        first_name,
        last_name,
        email,
        phone,
        pending,
        online
        created_at,
        business_name,
        business_name_slug,
        business_address,
        business_image,
        business_bio,
        customer_address,
      }
    }
    `;
  async function fetchUser() {
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
    <UserContext.Provider value={{ User, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
