import axios from "axios";
import { useWindowDimensions, Text, FlatList, View, Image } from "react-native";
import { Button } from "react-native-paper";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";

export function Venta({ route }) {
  let { id, cliente, detalles, entregado, fecha, fechaEntrega } = route.params;
  const [fechaentrega, setFechaentrega] = useState(fechaEntrega);
  const [cargando, setcargando] = useState(false);
  const [btnVisible, setBtnVisible] = useState(!entregado);
  const { width } = useWindowDimensions();
  console.log(cliente);
  async function entregarProducto() {
    setcargando(true);
    try {
      const { data } = await axios.put(`/ventas/${id}`);
      console.log(data);
      if (data.entregado) {
        setFechaentrega(data.fechaEntrega);
        setBtnVisible(false);
      }
    } catch (error) {
      console.warn(error);
    }
    setcargando(false);
  }
  return (
    <FlatList
      contentContainerStyle={{ padding: 15 }}
      ListHeaderComponent={() => (
        <View>
          <Text style={{ fontSize: 20 }}>Cliente: {cliente.nombre} </Text>
          <Text
            style={[
              { fontSize: 20 },
              !btnVisible ? { color: "green" } : { color: "red" },
            ]}
          >
            Entregado: {!btnVisible ? "Si" : "No"}{" "}
          </Text>
          <Text style={{ fontSize: 20 }}>
            Fecha venta: {new Date(fecha).toLocaleDateString()}
          </Text>
          {fechaentrega ? (
            <Text style={{ fontSize: 20 }}>
              Fecha Entrega: {new Date(fechaentrega).toLocaleDateString()}
            </Text>
          ) : null}
          {btnVisible ? (
            <Button
              loading={cargando}
              onPress={entregarProducto}
              style={{ margin: 15 }}
              mode="contained"
            >
              Marcar como Entregado
            </Button>
          ) : null}
          <Text style={{ fontSize: 20 }}>Productos: </Text>
        </View>
      )}
      data={detalles}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => (
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <Image
            style={{ width: 100, height: 100 }}
            source={
              item.producto.imagenes.length
                ? {
                    uri: item.producto.imagenes[0].imagenUrl,
                  }
                : require("../assets/helmet.png")
            }
          />
          <View style={{ marginStart: 10 }}>
            <Text> {item.producto.nombre} </Text>
            <Text> Precio: lps. {item.precio} </Text>
            <Text> Total: lps. {item.precio * item.cantidad} </Text>
            <Text> Cantidad: {item.cantidad} </Text>
          </View>
        </View>
      )}
      ListFooterComponent={() => (
        <>
          <Text style={{ fontSize: 20 }}>Direccion:{cliente.direccion}</Text>

          {cliente.latitude && cliente.longitude ? (
            <MapView
              initialRegion={{
                latitude: cliente.latitude,
                longitude: cliente.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              style={{ width, height: width }}
            >
              <Marker
                coordinate={{
                  latitude: cliente.latitude,
                  longitude: cliente.longitude,
                }}
                title={cliente.nombre}
              />
            </MapView>
          ) : null}
        </>
      )}
    />
  );
}
