import axios from "axios";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  Image,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export function Productos({ navigation }) {
  const [cargando, setCargando] = useState(false);
  const [productos, setProductos] = useState([]);
  const [inicio, setInicio] = useState(0);
  const [cantidad] = useState(5);
  const [argumento, setArgumento] = useState("");
  const { width } = useWindowDimensions();
  const [maxReached, setMaxReached] = useState(false);
  useEffect(() => {
    solicitarProductos();
  }, []);

  // relacionado con la barra de busqueda
  async function buscar(value) {
    setDefaultHeaderTitle();
    setArgumento(value);
    console.log("Buscar:", value);
    setCargando(true);
    const { data } = await axios.get("/productos", {
      params: { nombre: value },
    });
    setCargando(false);
    setProductos(data);
    setInicio(data.length);
  }

  /**
   * @type {React.MutableRefObject<TextInput>}
   */
  const buscarInputRef = useRef();

  function setDefaultHeaderTitle() {
    navigation.setOptions({
      headerTitle: "Productos",
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
  // relacionado con la barra de busqueda

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
  async function refreshProds() {
    setCargando(true);
    const { data } = await axios.get("/productos");
    setCargando(false);
    console.log(data);
    setProductos(data);
    setMaxReached(false);
    setInicio(data.length);
    setArgumento(undefined);
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        onEndReached={argumento ? undefined : solicitarProductos}
        onEndReachedThreshold={0.1}
        refreshing={cargando}
        onRefresh={refreshProds}
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
