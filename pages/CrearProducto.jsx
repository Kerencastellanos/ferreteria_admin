import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { Divider, Menu } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  requestCameraPermissionsAsync,
  launchCameraAsync,
  launchImageLibraryAsync,
  getCameraPermissionsAsync,
} from "expo-image-picker";
export function CrearProducto() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [tienePermiso, setTienePermiso] = useState(false);
  const [cargando, setCargando] = useState(false);
  function alternarMenu() {
    setMenuVisible(!menuVisible);
  }
  useEffect(() => {
    solicitarPermisos();
  }, []);
  async function solicitarPermisos() {
    setCargando(true);
    const cameraPermission = await getCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      const res = await requestCameraPermissionsAsync();
      setCargando(false);
      setTienePermiso(res.granted);
    }
  }
  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color="blue" />
      </View>
    );
  }

  if (cargando) {
    return <View style={styles.container}></View>;
  }
  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={alternarMenu}
        anchor={
          <TouchableOpacity onPress={alternarMenu}>
            <FontAwesome name="photo" size={100} color="black" />
          </TouchableOpacity>
        }
      >
        <Menu.Item title="Tomar Foto" icon={"camera"} />
        <Divider />
        <Menu.Item title="Buscar en Galeria " icon={"image"} />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
