import axios from "axios";
import { View, FlatList, Text, Image } from "react-native";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";

export function Productos() {
  const [cargando, setCargando] = useState(false);
  const [productos, setProductos] = useState();
  useEffect(() => {
    solicitarProductos();
  }, []);
  async function solicitarProductos() {
    setCargando(true);
    const { data } = await axios.get("/productos");
    setCargando(false);
    console.log(data);
    setProductos(data);
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        refreshing={cargando}
        onRefresh={solicitarProductos}
        contentContainerStyle={{ padding: 10 }}
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 10,
              borderBottomColor: "#d1d1d1",
              borderBottomWidth: 1,
              padding: 5,
            }}
          >
            {item.imagenes.length ? (
              <Image
                source={{
                  uri: item.imagenes[0].imagenUrl,
                  width: 100,
                  height: 100,
                }}
              />
            ) : (
              <Entypo name="image" size={100} color="black" />
            )}

            <View>
              <Text>{item.nombre}</Text>
              <Text>Cantidad: {item.stock}</Text>
              <Text>Precio: Lps.{item.precio}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
