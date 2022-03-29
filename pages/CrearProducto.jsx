import {
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  useWindowDimensions,
  Text,
  Image,
} from "react-native";
import { Button, Divider, Menu, TextInput } from "react-native-paper";
import { useReducer, useState, useEffect } from "react";
import {
  requestCameraPermissionsAsync,
  launchCameraAsync,
  launchImageLibraryAsync,
  getCameraPermissionsAsync,
  MediaTypeOptions,
} from "expo-image-picker";

export function CrearProducto() {
  const { width } = useWindowDimensions();

  const [menuVisible, setMenuVisible] = useState(false);
  const [tienePermiso, setTienePermiso] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [ready, setReady] = useState(false);
  const [prod, setProd] = useReducer(
    (prev, newState) => {
      return { ...prev, ...newState };
    },
    { nombre: "", precio: "", cantidad: "", imagenes: [] }
  );
  useEffect(() => {
    if (prod.precio && prod.cantidad && prod.nombre && prod.imagenes.length) {
      setReady(true);
      return;
    }
    setReady(false);
  }, [prod]);

  function alternarMenu() {
    setMenuVisible(!menuVisible);
  }
  useEffect(() => {
    solicitarPermisos();
  }, []);
  async function solicitarPermisos() {
    setCargando(true);
    let cameraPermission = await getCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      cameraPermission = await requestCameraPermissionsAsync();
    }
    setTienePermiso(cameraPermission.granted);
    setCargando(false);
  }
  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color="blue" />
      </View>
    );
  }
  async function openGallery() {
    alternarMenu();
    const res = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
    });
    console.log(res);
    prod.imagenes.push(res);
  }

  async function openCamera() {
    alternarMenu();
    const res = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
    });
    prod.imagenes.push(res);
  }
  if (!cargando && !tienePermiso) {
    return (
      <View style={styles.container}>
        <Text>Nesesita permiso para acceder a la camara y fotos </Text>
        <Button onPress={solicitarPermisos}>Volver a Solicitar Permisos</Button>
      </View>
    );
  }
  return (
    <ScrollView>
      {prod.imagenes.length ? (
        <FlatList
          pagingEnabled={true}
          keyExtractor={(item) => item.uri}
          data={prod.imagenes}
          renderItem={({ item, index }) => (
            <View style={{ position: "relative" }}>
              <Text
                style={{
                  position: "absolute",
                  zIndex: 999,
                  padding: 10,
                  borderRadius: 5,
                  right: 5,
                  top: 5,
                  color: "white",
                  backgroundColor: "#333",
                }}
              >
                {index + 1}/{prod.imagenes.length}
              </Text>
              <Image source={{ uri: item.uri, width, height: width }} />
            </View>
          )}
          horizontal
        />
      ) : null}
      <View style={{ padding: 15, backgroundColor: "#fff" }}>
        <Menu
          visible={menuVisible}
          onDismiss={alternarMenu}
          anchor={
            <Button icon={"camera"} mode="outlined" onPress={alternarMenu}>
              Imagenes
            </Button>
          }
        >
          <Menu.Item onPress={openCamera} title="Tomar Foto" icon={"camera"} />
          <Divider />
          <Menu.Item
            onPress={openGallery}
            title="Buscar en Galeria "
            icon={"image"}
          />
        </Menu>
        <TextInput
          onChangeText={(nombre) => setProd({ nombre })}
          value={prod.nombre}
          style={styles.input}
          label={"Nombre"}
        />
        <TextInput
          onChangeText={(precio) => setProd({ precio })}
          value={prod.precio}
          keyboardType="numeric"
          error={isNaN(prod.precio)}
          style={styles.input}
          label={"Precio"}
        />
        <TextInput
          onChangeText={(cantidad) => setProd({ cantidad })}
          keyboardType="numeric"
          value={prod.cantidad}
          error={isNaN(prod.cantidad)}
          style={styles.input}
          label={"Cantidad"}
          clearButtonMode={"while-editing"}
        />
        <Button disabled={!ready}>Subir</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: "#fcfcfc",
    marginVertical: 5,
  },
});
