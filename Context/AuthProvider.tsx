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

export const AuthContext = createContext<props>(undefined);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
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
      setToken(res.data.accessToken);
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        return Cookies.remove("role");
      }
      console.log(error.message);
    }
  }

  return (
    <AuthContext.Provider value={{ Token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
