// @ts-check
import {
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import { useState, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");

export function Cliente({ route }) {
  // variables
  const {
    imagenUrl,
    nombre,
    latitude,
    longitude,
    correo,
    telefono,
    bloque,
    colonia,
    ciudad,
    direccion,
  } = route.params;
  const [collapsed, setCollapsed] = useState(true);
  const mapaRef = useRef();
  // funciones

  // renderizar

  return (
    <ScrollView style={{ padding: 10, backgroundColor: "white" }}>
      <View
        style={[
          {
            alignSelf: "center",
          },
          imagenUrl && {
            borderRadius: 100,
            borderColor: "#f3f3f3",
            borderWidth: 1,
          },
        ]}
      >
        {imagenUrl ? (
          <Image
            source={{ uri: imagenUrl, width: 200, height: 200 }}
            style={{
              borderRadius: 100,
            }}
          />
        ) : (
          <MaterialIcons
            name="account-circle"
            size={200}
            color="#3495eb"
            style={{ padding: 0 }}
          />
        )}
      </View>
      <View>
        <Text>Nombre:</Text>
        <TextInput disabled value={nombre} />
      </View>
      <View>
        <Text>Correo: </Text>
        <TextInput disabled value={correo} />
      </View>

      <View>
        <Text>Número de telefono: </Text>
        <TextInput disabled value={telefono} />
      </View>

      <TouchableOpacity
        style={{
          flexDirection: "row",
        }}
        onPress={() => setCollapsed(!collapsed)}
      >
        <Text>Direccion</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
      </TouchableOpacity>

      {collapsed ? (
        <></>
      ) : (
        <>
          <View>
            <Text>Ciudad:</Text>
            <TextInput disabled value={ciudad} />
          </View>
          <View>
            <Text>Colonia:</Text>
            <TextInput disabled value={colonia} />
          </View>
          <View>
            <Text>Bloque:</Text>
            <TextInput disabled value={bloque} />
          </View>
          <View>
            <Text>Detalles: </Text>
            <TextInput disabled value={direccion} />
          </View>
        </>
      )}
      {latitude && longitude ? (
        <MapView
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          ref={mapaRef}
          style={{ width, height: width }}
        >
          <Marker coordinate={{ latitude, longitude }} title={nombre} />
        </MapView>
      ) : null}
    </ScrollView>
  );
}
