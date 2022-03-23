import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  isAuth: false,
  setIsAuth(isAuth = true) {},
  setAToken(aToken = "") {},
  setRToken(rToken = "") {},
  rToken: "",
  aToken: "",
  gotoLogin: false,
  setUser(user) {},
  user: { name: "", email: "", imageUrl: "" },
  checkAuth() {},
});

export function AuthProvider({ children }) {
  const [gotoLogin, setGotoLogin] = useState(false);
  const [user, setUser] = useState({});
  const [aToken, setAToken] = useState("");
  const [rToken, setRToken] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    axios.defaults.headers = {
      Authentication: aToken,
    };
    checkAuth();
    saveTokens();
  }, [aToken, rToken]);
  async function saveTokens() {
    if (aToken && rToken) {
      AsyncStorage.setItem("aToken", aToken);
      AsyncStorage.setItem("rToken", rToken);
    }
  }

  useEffect(() => {
    axios.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        checkAuth();
        return Promise.reject(error);
      }
    );
    CheckTokens();
  }, []);

  async function CheckTokens() {
    const a_Token = await AsyncStorage.getItem("aToken");
    const r_Token = await AsyncStorage.getItem("rToken");
    console.log("a_Token: ", a_Token, "r_Token: ", r_Token);
    if (a_Token && r_Token) {
      console.log("tokens loaded from storage");
      setAToken(a_Token);
      setRToken(r_Token);
    }
  }

  async function checkAuth() {
    console.log("rToken: ", rToken);
    if (rToken) {
      console.log("checkAuth");
      try {
        const { data } = await axios.get("/usuarios/me");

        console.log("data: ", data);
        if (data.usuario) {
          console.log("auth true");
          setUser(data.usuario);
          setIsAuth(true);
          return;
        }
        console.log("refresh Token");
        const { data: data2 } = await axios.post("/auth/refresh", {
          refreshToken: rToken,
        });
        console.log("data2: ", data2);
        if (data2.accessToken) {
          console.log("new AToken");
          setAToken(data2.accessToken);
          return;
        }
        setGotoLogin(true);
      } catch (error) {
        console.warn(error);
      }
      return;
    }
    setIsAuth(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        gotoLogin,
        user,
        setUser,
        aToken,
        rToken,
        setAToken,
        setRToken,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
