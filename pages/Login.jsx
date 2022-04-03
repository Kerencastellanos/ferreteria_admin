import { StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { ScrollView, Text, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { AuthContext } from "../context";
import { TextInput } from "react-native-paper";

export function Login({ navigation, route }) {
  const { setAuth } = useContext(AuthContext);
  async function enviarDatos() {
    const { data } = await axios.post("/auth/login", {
      correo,
      clave,
    });
    if (data.error) {
      alert(data.error);
      return;
    }
    if (!data.accessToken || !data.refreshToken) {
      alert("Habido un error vuelva a intentar");
      return;
    }
    setAuth({ aToken: data.accessToken, rToken: data.refreshToken });
  }
  const [correo, setCorreo] = useState(route.params || "");
  const [clave, setClave] = useState("");

  function irARecuperarClave() {
    navigation.navigate("RecuperarClave", correo);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/helmet.png")}
      ></Image>

      <Text style={styles.logoText}>Login Bienvenido</Text>

      <TextInput
        style={styles.input}
        label="Correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType={"email-address"}
      />

      <TextInput
        style={styles.input}
        value={clave}
        onChangeText={setClave}
        label="Clave"
        password={true}
      />

      <TouchableOpacity onPress={irARecuperarClave}>
        <Text style={styles.txt}>¿Olvido su contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={enviarDatos}>
        <Text style={styles.btnText}>Ingresar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#fff",
    //justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    padding: 50,
    marginTop: 30,
    alignSelf: "center",
  },
  logoText: {
    marginVertical: 15,
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },

  btn: {
    width: "80%",
    backgroundColor: "#00388b",
    marginVertical: 30,
    paddingVertical: 20,
    borderRadius: 5,
    textAlign: "center",
    textShadowColor: "#191970",
    alignSelf: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  txt: {
    color: "#0080FF",
    fontWeight: "500",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fcfcfc",
    margin: 15,
  },
});
