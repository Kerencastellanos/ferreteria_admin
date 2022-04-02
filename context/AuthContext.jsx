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
  async checkAuth() {},
  async refreshToken() {},
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
  }, [aToken]);

  useEffect(() => {
    saveTokens();
  }, [aToken, rToken]);

  useEffect(() => {
    if (rToken) {
      axios.interceptors.response.use(async (res) => {
        if (res.data.error && res.data.error.includes("jwt")) {
          console.log("interceptors ");
          console.log(res.data.error);
          console.log("rToken:", rToken);
          const atoken = await refreshToken();
          if (!atoken) {
            return res;
          }
          console.log(res.config.data);
          return await axios.request({
            ...res.config,
            headers: { Authentication: atoken },
          });
        }
        return res;
      });
    }
    checkAuth();
  }, [rToken]);

  async function saveTokens() {
    if (aToken && rToken) {
      AsyncStorage.setItem("aToken", aToken);
      AsyncStorage.setItem("rToken", rToken);
    }
  }

  useEffect(() => {
    CheckTokens();
  }, []);

  async function refreshToken() {
    if (!rToken) {
      console.log("No hay rToken");
      return;
    }
    console.log("refresh Token ", rToken);
    const { data } = await axios.post("/auth/refresh", {
      refreshToken: rToken,
    });
    console.log("data2: ", data);
    if (data.accessToken) {
      console.log("new AToken");
      setAToken(data.accessToken);
      return data.accessToken;
    }
    setGotoLogin(true);
  }
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
    console.log("checkAuth-rToken: ", rToken);
    if (rToken) {
      console.log("checkAuth");
      try {
        const { data } = await axios.get("/usuarios/me");

        console.log("checkAuth-data: ", data);
        if (data.usuario) {
          console.log("auth true");
          setUser(data.usuario);
          setIsAuth(true);
          return;
        }
      } catch (error) {
        console.warn(error);
      }
      return;
    }
    console.log("auth false");
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
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
