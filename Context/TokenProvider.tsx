import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { restLink } from "@/utils/client";

interface props {
  Token: string;
  setToken: Dispatch<SetStateAction<string>>;
}

export const TokenContext = createContext<props>(undefined);
export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [Token, setToken] = useState("");

  useEffect(() => {
    fetchRefreshToken();
  }, []);

  async function fetchRefreshToken() {
    const instance = axios.create({
      withCredentials: true,
    });

    try {
      const res = await instance.post(restLink[0], {
        rToken: Cookies.get("ecom"),
      });

      if (res.data) {
        //setting cookies client side, should be done over server, but i ran into heroku/vercel problems in production
        Cookies.set("role", res.data.role, {
          expires: 7,
        });

        Cookies.set("ecom", res.data.refreshtoken, {
          expires: 7,
          // secure: true,
        });
        setToken(res.data.accesstoken);
      }
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        Cookies.remove("role");
      }
      // console.log(error.message);
    }
  }

  return (
    <TokenContext.Provider value={{ Token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
