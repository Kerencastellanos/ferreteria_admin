import { StyleSheet, View } from "react-native";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context";
import * as SplashScreen from "expo-splash-screen";
export function Splash({ navigation }) {
  const { goToLogin } = useContext(AuthContext);
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    console.log("Splash:", goToLogin);
    SplashScreen.hideAsync().then((res) => {
      if (goToLogin) {
        navigation.replace("login");
      }
    });
  }, [goToLogin]);

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
