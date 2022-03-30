import axios from "axios";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, FlatList, View, Text } from "react-native";

export function Clientes({ navigation }) {
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => {
    obtenerClientes();
  }, []);

  async function obtenerClientes() {
    setCargando(true);
    const { data } = await axios.get("/usuarios");
    setCargando(false);
    console.log(data);
    setUsuarios(data.usuarios);
  }
  function verCliente(cliente) {
    return () => {
      navigation.navigate("Cliente", cliente);
    };
  }
  return (
    <FlatList
      refreshing={cargando}
      onRefresh={obtenerClientes}
      style={{ flex: 1 }}
      data={usuarios}
      keyExtractor={(item) => item.id}
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
