import { Button, Text, StyleSheet, View } from "react-native";
import { AuthContext } from "../context";
import { useContext } from "react";
export function Login() {
  const { setIsAuth } = useContext(AuthContext);

  function establecerAuth() {
    setIsAuth(true);
  }

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Button title="Entar" onPress={establecerAuth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
