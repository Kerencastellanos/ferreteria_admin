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
  // permise ejecutar codifo cada vez q
  // cambian las dependencias dentro de []
  useEffect(() => {
    // solo se ejecuta al inicio
    obtenerVentas();
  }, []); // propiedades q evalua para volver a aejecutarse

  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(false);
  async function obtenerVentas() {
    setCargando(true);
    const { data } = await axios.get("/ventas/listar"); // realizar peticion a la api
    console.log("Respuesta de /ventas/listar:", data);
    setCargando(false);
    setVentas(data.ventas);
  }
  function verVenta(venta) {
    navigation.navigate("Venta", venta);
  }
  return (
    <FlatList
      data={ventas}
      refreshing={cargando}
      onRefresh={obtenerVentas}
      contentContainerStyle={{ padding: 15 }}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => verVenta(item)}
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
          {/* contenedor */}
          <View>
            <Text>{item.cliente.nombre}</Text>
            <Text>
              {item.detalles.reduce(
                (prev, detalle) => prev + detalle.cantidad,
                0
              )}{" "}
              Items
            </Text>
            <Text>{new Date(item.fecha).toLocaleString()}</Text>
          </View>
          {/* contenedor */}
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
