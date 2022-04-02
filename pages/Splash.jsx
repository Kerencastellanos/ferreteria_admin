import { Image, Text, StyleSheet, View } from "react-native";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context";
import * as SplashScreen from "expo-splash-screen";
export function Splash({ navigation }) {
  const { gotoLogin } = useContext(AuthContext);
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    console.log("Splash:", gotoLogin);
    SplashScreen.hideAsync().then((res) => {
      if (gotoLogin) {
        navigation.replace("login");
      }
    });
  }, [gotoLogin]);

  return <View></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
