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
      const res = await instance.post(`http://localhost:4000/api/refreshtoken`);
      if (res.data) {
        setToken(res.data.accessToken);
      }
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        return Cookies.remove("role");
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
