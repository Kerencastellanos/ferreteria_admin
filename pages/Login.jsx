import { StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { ScrollView, Text, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { AuthContext } from "../context";
import { Input } from "../components";

export function Login({ navigation, route }) {
  const { setAToken, setRToken } = useContext(AuthContext);

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
    setAToken(data.accessToken);
    setRToken(data.refreshToken);
    navigation.navigate("Cart");
  }
  const [correo, setCorreo] = useState(route.params || "");
  const [clave, setClave] = useState("");

  function irARecuperarClave() {
    navigation.navigate("RecuperarClave", correo);
  }
  function irARegistro() {
    navigation.navigate("Registro");
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/helmet.png")}
      ></Image>

      <Text style={styles.logoText}>Login Bienvenido</Text>

      <Input
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType={"email-address"}
      />

      <Input
        value={clave}
        onChangeText={setClave}
        placeholder="Clave"
        password={true}
      />

      <TouchableOpacity onPress={irARecuperarClave}>
        <Text style={styles.txt}>¿Olvide mi contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={enviarDatos}>
        <Text style={styles.btnText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={irARegistro}>
        <Text>
          ¿No tienes una cuenta? <Text style={styles.txt}>Registrate</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#fff",
    //justifyContent: 'center',
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    padding: 50, 
    marginTop: 30,
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
  },
});
