import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { graphQLClient } from "../utils/client";
import { useAuth } from "./AuthProvider";
import { UsersRes } from "../Typescript/types";

interface props {
  User: UsersRes;
  setUser: Dispatch<SetStateAction<any>>;
}

export const UserContext = createContext<props>(undefined);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [User, setUser] = useState<UsersRes>({});

  const { Token } = useAuth();

  useEffect(() => {
    fetchUser();
  }, [Token]);

  const getUser = `
    query getUser{
      getUser{
        first_name
        business_name_slug
        business_name
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
