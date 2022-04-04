import {
  ActivityIndicator,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
  Text,
  Image,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  Chip,
  Button,
  Divider,
  Menu,
  TextInput,
  IconButton,
  Searchbar,
  FAB,
} from "react-native-paper";
import { useRef, useReducer, useState, useEffect } from "react";
import {
  requestCameraPermissionsAsync,
  launchCameraAsync,
  launchImageLibraryAsync,
  getCameraPermissionsAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import axios from "axios";
import { compareObjs, objsDiff } from "../constantes";

export function CrearProducto({ route }) {
  const params = route.params;
  const [buscar, setBuscar] = useState("");

  const [cargandoCats, setCargandoCats] = useState(false);
  const { width } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [tienePermiso, setTienePermiso] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [ready, setReady] = useState(false);

  /**
   * @type {React.MutableRefObject<FlatList<any>>}
   */
  const timeRef = useRef();
  const flatlistRef = useRef();
  const [categoria, setCategoria] = useState({ id: 0, nombre: "" });
  const [categorias, setCategorias] = useState([]);
  const [prodCopy, setProdCopy] = useState({});
  const [prod, setProd] = useReducer(
    (prev, newState) => {
      return { ...prev, ...newState };
    },
    {
      categoriaFk: 1,
      descripcion: "",
      nombre: "",
      precio: 0,
      stock: 0,
      imagenes: [],
    }
  );

  function buscarFn(nombre) {
    setBuscar(nombre);
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(() => {
      solicitarcategorias(nombre);
    }, 1000);
  }
  async function solicitarcategorias(nombre = "") {
    if (!categorias.length || nombre) {
      setCargandoCats(true);
      const { data } = await axios.get("/categorias", { params: { nombre } });
      setCargandoCats(false);
      setCategorias(data);
    }
  }
  async function updateProd() {
    let prodDiff = objsDiff(prodCopy, prod);
    const body = new FormData();
    Object.keys(prodDiff).forEach((k) => {
      if (k != "imagenes") {
        body.append(k, prodDiff[k]);
      }
    });
    if (prodDiff.imagenes) {
      let imagenes = prodDiff.imagenes.filter((e) => !e.startsWith("https"));
      imagenes.forEach(({ type, uri }) => {
        let parts = uri.split("ImagePicker/");
        let name = parts[1];
        body.append("imagenes", {
          name,
          type: `${type}/${name.split(".")[1]}`,
          uri,
        });
      });
    }
    body.append("id", prod.id);
    console.log(body);
    setCargando(true);
    try {
      await fetch(`${axios.defaults.baseURL}/productos`, {
        method: "put",
        headers: {
          "Content-Type": "multipart/form-data",
          ...axios.defaults.headers, // token
        },
        body,
      });
      Alert.alert("Ferreteria Movil", `Producto actualizado con exito`);
    } catch (error) {
      console.warn(error);
    }
    setCargando(false);
  }
  async function subirProducto() {
    const body = new FormData();
    Object.keys(prod).forEach((k) => {
      if (k != "imagenes") {
        body.append(k, prod[k]);
      }
    });
    prod.imagenes.forEach(({ type, uri, imagenUrl }) => {
      let parts = uri ? uri.split("ImagePicker/") : imagenUrl.split("com/");
      let name = parts[1];
      body.append("imagenes", {
        name,
        type: `${type}/${name.split(".")[1]}`,
        uri,
      });
    });

    setCargando(true);
    await fetch(`${axios.defaults.baseURL}/productos`, {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        ...axios.defaults.headers, // token
      },
      body,
    });
    setProd({
      categoriaFk: 1,
      descripcion: "",
      nombre: "",
      precio: 0,
      stock: 0,
      imagenes: [],
    });
    Alert.alert("Ferreteria Movil", `Producto creado con exito`);

    setCargando(false);
  }

  useEffect(() => {
    if (
      prod.precio &&
      prod.stock &&
      prod.nombre &&
      prod.imagenes.length &&
      prod.categoriaFk &&
      !compareObjs(prod, prodCopy)
    ) {
      setReady(true);
      return;
    }
    setReady(false);
  }, [prod]);

  function alternarMenu() {
    setMenuVisible(!menuVisible);
  }
  useEffect(() => {
    if (params) {
      setProdCopy({ ...params, categoriaFk: params.categoria.id });
      setProd({ ...params, categoriaFk: params.categoria.id });
      setCategoria(params.categoria);
    }
    solicitarcategorias();
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

  async function openGallery() {
    alternarMenu();
    const res = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
    });
    console.log(res);
    if (!res.cancelled) {
      setProd({ imagenes: [...prod.imagenes, res] });
    }
  }
  function removeImagen(imagen, index) {
    return () => {
      setProd({ imagenes: prod.imagenes.filter((i) => i.uri != imagen.uri) });
      if (index != 0) {
        flatlistRef.current.scrollToIndex({
          index: index - 1,
        });
      }
    };
  }
  async function crearCategoria(categoria) {
    /**
     * @type{{data:number}}
     */
    const { data } = await axios.post("/categorias", categoria);
    return data;
  }
  async function seleccionarCategoria(categoria) {
    setModalVisible(false);
    if (!categoria.id) {
      const id = await crearCategoria(categoria);
      categoria.id = id;
    }
    setProd({ categoriaFk: categoria.id });
    setCategoria(categoria);
  }

  async function openCamera() {
    alternarMenu();
    const res = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
    });
    console.log(res);
    if (!res.cancelled) {
      setProd({ imagenes: [...prod.imagenes, res] });
    }
  }

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color="blue" />
      </View>
    );
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
    <>
      <ScrollView style={{ backgroundColor: "white" }}>
        {prod.imagenes.length ? (
          <FlatList
            ref={flatlistRef}
            pagingEnabled={true}
            keyExtractor={(_, i) => i.toString()}
            data={prod.imagenes}
            renderItem={({ item, index }) => (
              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  onPress={removeImagen(item, index)}
                  style={{
                    position: "absolute",
                    zIndex: 998,
                    right: 5,
                    top: 5,
                    padding: 2,
                    borderRadius: 15,
                    color: "white",
                    backgroundColor: "#333",
                  }}
                >
                  <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text
                  style={{
                    position: "absolute",
                    zIndex: 999,
                    padding: 5,
                    borderRadius: 5,
                    right: 5,
                    bottom: 5,
                    color: "white",
                    backgroundColor: "#333",
                  }}
                >
                  {index + 1}/{prod.imagenes.length}
                </Text>
                <Image
                  source={{
                    uri: item.uri || item.imagenUrl,
                    width,
                    height: width,
                  }}
                />
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
            <Menu.Item
              onPress={openCamera}
              title="Tomar Foto"
              icon={"camera"}
            />
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
            onChangeText={(descripcion) => setProd({ descripcion })}
            value={prod.descripcion}
            style={styles.input}
            multiline={true}
            label={"Descripcion"}
          />
          <TextInput
            onChangeText={(precio) => setProd({ precio: Number(precio) })}
            value={String(prod.precio)}
            keyboardType="numeric"
            error={isNaN(prod.precio)}
            style={styles.input}
            label={"Precio"}
          />
          <TextInput
            onChangeText={(stock) => setProd({ stock: Number(stock) })}
            keyboardType="numeric"
            value={String(prod.stock)}
            error={isNaN(prod.stock)}
            style={styles.input}
            label={"Cantidad"}
            clearButtonMode={"while-editing"}
          />
          <Button
            style={{ alignSelf: "flex-start" }}
            icon={"menu-down"}
            onPress={() => setModalVisible(true)}
          >
            {categoria.nombre || "Categoria"}
          </Button>
        </View>
      </ScrollView>
      <Modal onDismiss={() => setModalVisible(false)} visible={modalVisible}>
        <View style={{ backgroundColor: "white", padding: 15 }}>
          <IconButton
            icon={"chevron-down"}
            onPress={() => setModalVisible(false)}
          />
          <Searchbar
            style={styles.input}
            value={buscar}
            onChangeText={buscarFn}
            placeholder={"Buscar..."}
          />
          <FlatList
            refreshing={cargandoCats}
            onRefresh={solicitarcategorias}
            keyExtractor={(item) => item.id}
            data={categorias}
            ListEmptyComponent={() =>
              buscar ? (
                <>
                  <Text style={{ textAlign: "center" }}>
                    Click en la categoria "{buscar}"" para crear
                  </Text>
                  <Chip
                    style={{ marginVertical: 5 }}
                    icon="check"
                    onPress={() => seleccionarCategoria({ nombre: buscar })}
                  >
                    {buscar}
                  </Chip>
                </>
              ) : null
            }
            renderItem={({ item }) => (
              <Chip
                style={{ marginVertical: 5 }}
                icon="information"
                onPress={() => seleccionarCategoria(item)}
              >
                {item.nombre}
              </Chip>
            )}
          />
        </View>
      </Modal>
      <FAB
        theme={{
          colors: {
            accent: "#035efc",
          },
        }}
        label={params ? "Actualizar" : "Subir producto"}
        icon={"cloud-upload"}
        style={{
          position: "absolute",
          bottom: 20,
          right: 10,
        }}
        onPress={params ? updateProd : subirProducto}
        disabled={!ready}
      />
    </>
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
