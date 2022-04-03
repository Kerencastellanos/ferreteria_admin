import axios from "axios";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";

export function Productos({ navigation }) {
  const [cargando, setCargando] = useState(false);
  const [productos, setProductos] = useState([]);
  const [inicio, setInicio] = useState(0);
  const [cantidad, setCantidad] = useState(5);
  const [maxReached, setMaxReached] = useState(false);
  useEffect(() => {
    solicitarProductos();
  }, []);
  async function solicitarProductos() {
    if (maxReached) {
      return;
    }
    setCargando(true);
    const { data } = await axios.get("/productos", {
      params: { inicio, cantidad },
    });
    setCargando(false);
    console.log(data.length);
    if (!data.length) {
      setMaxReached(true);
      return;
    }
    setProductos([...productos, ...data]);
    // paginacion proxima solicitud seran los siguientes 10 productos
    setInicio(inicio + cantidad);
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        onEndReached={solicitarProductos}
        onEndReachedThreshold={0.1}
        refreshing={cargando}
        onRefresh={solicitarProductos}
        contentContainerStyle={{ padding: 10 }}
        data={productos}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() =>
          cargando ? <ActivityIndicator size={"large"} color="blue" /> : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditarProducto", item)}
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
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
