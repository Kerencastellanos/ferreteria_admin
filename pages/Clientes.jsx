import axios from "axios";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, FlatList, View, Text } from "react-native";

export function Clientes({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => {
    obtenerClientes();
  }, []);

  async function obtenerClientes() {
    const { data } = await axios.get("/usuarios");
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
