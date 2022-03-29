import {
  Alert,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";

export function RecuperarClave({ route, navigation }) {
  const [page, setPage] = useState("");
  const [correo, setCorreo] = useState(route.params || "");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");

  const [pin, setPin] = useState("");
  async function cambiarClave() {
    if (clave == clave2) {
      setPage("cargando");
      const { data } = await axios.post("/auth/clave", { pin, clave, correo });

      Alert.alert("Ferreteria movil", data.error || data.msg);
      setPage("pinverficado");
      if (data.error) {
        setPin(0);
      }
      if (data.msg) {
        navigation.navigate("Login", correo);
      }
      return;
    }
    Alert.alert("Ferreteria movil", "Las claves no coinciden ");
  }
  async function verificarPin() {
    if (pin) {
      try {
        setPage("cargando");
        const { data } = await axios.post("/auth/pin", { pin, correo });

        setPage("pinenviado");
        if (data.error) {
          Alert.alert("Ferreteria movil", data.error);
          return;
        }
        if (data.msg) {
          setPage("pinverficado");
        }
      } catch (error) {
        setPage("pinenviado");
        Alert.alert("Ferreteria movil", error.message);
      }
      return;
    }
    Alert.alert("Ferreteria movil", "ingrese el pin");
  }

  async function enviarPin() {
    if (correo) {
      try {
        setPage("cargando");
        const { data } = await axios.post("/auth/recuperar", {
          correo,
        });
        setPage("");
        if (data.error) {
          Alert.alert("Ferreteria movil", data.error);
          return;
        }
        if (data.msg) {
          setPage("pinenviado");
          return;
        }
        Alert.alert("Ferreteria movil", "Ups ha habido un error");
      } catch (error) {
        setPage("");
        Alert.alert("Ferreteria movil", error.message);
      }

      return;
    }
    Alert.alert("Ferreteria movil", "ingrese un correo");
  }

  switch (page) {
    case "pinverficado":
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Establesca una nueva contraseña</Text>
          <TextInput
            value={clave}
            password={true}
            onChangeText={setClave}
            placeholder={"Nueva Clave"}
          />

          <TextInput
            value={clave2}
            onChangeText={setClave2}
            password={true}
            placeholder={"Confirmar Clave"}
          />
          <PrimaryButton onPress={cambiarClave} style={styles.btn}>
            Cambiar Clave{" "}
          </PrimaryButton>
        </View>
      );
    case "pinenviado":
      return (
        <View style={styles.container}>
          <Text style={styles.text}>
            Ingrese el pin de recuperacion que recibio en su correo
          </Text>
          <TextInput
            keyboardType="numeric"
            value={pin}
            onChangeText={setPin}
            placeholder={"pin"}
          />

          <Button onPress={verificarPin} style={styles.btn}>
            Verificar Pin
          </Button>
          <TouchableOpacity onPress={() => setPage("")}>
            <Text
              style={{
                color: "#3b82f6",
                borderBottomColor: "#3b82f6",
                borderBottomWidth: 1,
              }}
            >
              Obtener otro pin
            </Text>
          </TouchableOpacity>
        </View>
      );
    case "cargando":
      return (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} color="blue" />
        </View>
      );

    default:
      return (
        <View style={styles.container}>
          <Text style={styles.text}>
            Se le enviara un pin de recuperacion a su correo
          </Text>
          <Input
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
            placeholder={"correo"}
          />
          <PrimaryButton onPress={enviarPin} style={styles.btn}>
            Enviar pin{" "}
          </PrimaryButton>
          <TouchableOpacity onPress={() => setPage("pinenviado")}>
            <Text
              style={{
                color: "#3b82f6",
                borderBottomColor: "#3b82f6",
                borderBottomWidth: 1,
              }}
            >
              Ya tengo un pin
            </Text>
          </TouchableOpacity>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    padding: 20,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 25,
    color: "gray",
    marginBottom: 15,
  },
  btn: {
    width: "50%",
  },
});
