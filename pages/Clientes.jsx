import axios from "axios";
import { useEffect, useState } from "react";
import {
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  View,
  Text,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
export function Clientes({ navigation }) {
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [inicio, setInicio] = useState(0);
  const [cantidad] = useState(5);
  const [argumento, setArgumento] = useState("");
  const [maxReached, setMaxReached] = useState(false);

  async function buscar() {
    setCargando(true);
    const { data } = await axios.get("/usuarios", {
      params: { nombre: argumento },
    });
    setCargando(false);
    console.log("buscar:", data.usuarios);
    setUsuarios(data.usuarios);
  }
  useEffect(() => {
    obtenerClientes();
  }, []);

  async function obtenerClientes() {
    if (maxReached) {
      return;
    }
    setCargando(true);
    const { data } = await axios.get("/usuarios", {
      params: { inicio, cantidad },
    });
    setCargando(false);
    if (!data.usuarios.length) {
      setMaxReached(true);
      return;
    }
    console.log(data);
    setUsuarios([...usuarios, ...data.usuarios]);
    setInicio(inicio + cantidad);
  }
  function verCliente(cliente) {
    return () => {
      navigation.navigate("Cliente", cliente);
    };
  }
  return (
    <FlatList
      ListHeaderComponent={() => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ffff",
          }}
        >
          <TextInput
            onChangeText={setArgumento}
            value={argumento}
            placeholder="Buscar..."
            style={{
              flexGrow: 1,
              margin: 15,
              padding: 5,
            }}
          />
          <TouchableOpacity style={{ padding: 5 }} onPress={buscar}>
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
      refreshing={cargando}
      onRefresh={obtenerClientes}
      style={{ flex: 1 }}
      data={usuarios}
      onEndReached={obtenerClientes}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={() => (
        <Text style={{ textAlign: "center" }}>
          No se encontraron Usuarios con el argumento "{argumento}"
        </Text>
      )}
      keyExtractor={(item) => item.id}
      ListFooterComponent={() =>
        cargando ? <ActivityIndicator size={"small"} /> : null
      }
      renderItem={({ item }) => (
        <TouchableOpacity onPress={verCliente(item)}>
          <View
            style={{
              padding: 15,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fffff",
            }}
          >
            <Image
              source={
                item.imagenUrl
                  ? { uri: item.imagenUrl }
                  : require("../assets/helmet.png")
              }
              style={{
                borderRadius: 25,
                width: 50,
                height: 50,
                marginRight: 5,
              }}
            />
            <Text>{item.nombre}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
