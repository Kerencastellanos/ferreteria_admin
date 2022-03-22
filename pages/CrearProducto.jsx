import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Divider, Menu } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

export function CrearProducto() {
  const [menuVisible, setMenuVisible] = useState(false);

  function alternarMenu() {
    setMenuVisible(!menuVisible);
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
