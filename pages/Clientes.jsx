import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import axios from "axios";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import {
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  useWindowDimensions,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

/**
 *
 * @param {{navigation:NativeStackNavigationProp<{Clientes},"Clientes">}} param0
 */
export function Clientes({ navigation }) {
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [inicio, setInicio] = useState(0);
  const [cantidad] = useState(5);
  const [argumento, setArgumento] = useState("");
  const [maxUsuariosCount, setMaxUsuariosCount] = useState(1);
  const { width } = useWindowDimensions();
  async function buscar(value) {
    setDefaultHeaderTitle();
    setArgumento(value);
    console.log("Buscar:", value);
    setCargando(true);
    const { data } = await axios.get("/usuarios", {
      params: { nombre: value },
    });
    setCargando(false);
    setUsuarios(data.usuarios);
  }
  useEffect(() => {
    obtenerClientes();
  }, []);
  /**
   * @type {React.MutableRefObject<TextInput>}
   */
  const buscarInputRef = useRef();

  function setDefaultHeaderTitle() {
    navigation.setOptions({
      headerTitle: "Clientes",
      headerRight: () => (
        <TouchableOpacity style={{ padding: 5 }} onPress={setHeaderTitle}>
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerLeft: null,
    });
  }
  function setHeaderTitle() {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => buscarInputRef.current.clear()}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={setDefaultHeaderTitle}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <TextInput
          ref={buscarInputRef}
          autoFocus={true}
          onSubmitEditing={({ nativeEvent }) => buscar(nativeEvent.text)}
          placeholder="Buscar..."
          style={{
            flexGrow: 1,
            margin: 15,
            padding: 5,
            width: width * 0.7,
          }}
        />
      ),
    });
  }

  useLayoutEffect(() => {
    setDefaultHeaderTitle();
  }, []);
  async function refreshUsuarios() {
    setCargando(true);
    const { data } = await axios.get("/usuarios");
    setCargando(false);
    setUsuarios(data.usuarios);
  }
  async function obtenerClientes() {
    if (maxUsuariosCount == usuarios.length) {
      return;
    }
    setCargando(true);
    const { data } = await axios.get("/usuarios", {
      params: { inicio, cantidad },
    });
    setCargando(false);
    if (!data.usuarios.length) {
      setMaxUsuariosCount(usuarios.length);
      return;
    }
    setUsuarios([...usuarios, ...data.usuarios]);
    setInicio(inicio + cantidad);
  }
  function verCliente(cliente) {
    return () => {
      navigation.navigate("Cliente", cliente);
    };
  }
  return (
    <>
      <FlatList
        refreshing={cargando}
        onRefresh={refreshUsuarios}
        style={{ flex: 1 }}
        data={usuarios}
        onEndReached={obtenerClientes}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center" }}>
            No se encontraron Usuarios con el argumento "{argumento}"
          </Text>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() =>
          cargando ? <ActivityIndicator size={"small"} /> : null
        }
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
    </>
  );
}
