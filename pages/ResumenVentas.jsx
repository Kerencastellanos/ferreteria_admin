import axios from "axios";
import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  View,
  FlatList,
} from "react-native";

export function ResumenVentas({ navigation }) {
  useEffect(() => {
    obtenerVentas();
  }, []);

  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(false);
  async function obtenerVentas() {
    setCargando(true);
    const { data } = await axios.get("/ventas/listar");
    console.log(data.ventas[0]);
    setCargando(false);
    setVentas(data.ventas);
  }
  function verVenta(venta) {
    return (e) => {
      navigation.navigate("Venta", venta);
    };
  }
  return (
    <FlatList
      refreshing={cargando}
      contentContainerStyle={{ padding: 15 }}
      onRefresh={obtenerVentas}
      data={ventas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={verVenta(item)}
          style={{
            flexDirection: "row",
            marginVertical: 15,
            justifyContent: "space-between",
          }}
        >
          <Image
            source={{
              uri: item.detalles[0].producto.imagenes[0].url,
              width: 50,
              height: 50,
            }}
          />
          <View>
            <Text>{item.cliente.nombre}</Text>
            <Text>
              {item.detalles.reduce((prev, c) => prev + c.cantidad, 0)} Items
            </Text>
            <Text>{new Date(item.fecha).toLocaleString()}</Text>
          </View>
          <View>
            <Text>
              LPS.
              {item.detalles.reduce(
                (prev, c) => prev + c.cantidad * c.precio,
                0
              )}
            </Text>
            <Text style={{ color: item.entregado ? "green" : "red" }}>
              {item.entregado ? "Entregado" : "No entregado"}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
