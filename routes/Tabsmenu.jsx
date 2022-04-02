import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Clientes,
  CrearProducto,
  ResumenVentas,
  Productos,
  Imagenes,
} from "../pages";
import { AntDesign } from "@expo/vector-icons";
import { Button, IconButton } from "react-native-paper";
import axios from "axios";
import { AuthContext } from "../context";
import { useContext } from "react";

const Tabs = createBottomTabNavigator();

export function Tabsmenu() {
  const { setRToken } = useContext(AuthContext);
  async function cerrarSession() {
    try {
      const { data } = await axios.delete("/auth/logout");
      console.log(data);
      setRToken("");
    } catch (error) {
      console.warn(error);
    }
  }
  return (
    <Tabs.Navigator
      screenOptions={{
        headerRight: () => (
          <Button onPress={cerrarSession}>Cerrar Session</Button>
        ),
      }}
    >
      <Tabs.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="creditcard" size={size} color={color} />
          ),
        }}
        name="Ventas"
        component={ResumenVentas}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="pluscircleo" size={size} color={color} />
          ),
        }}
        name="CrearProducto"
        component={CrearProducto}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="customerservice" size={size} color={color} />
          ),
        }}
        name="Clientes"
        component={Clientes}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="shoppingcart" size={size} color={color} />
          ),
        }}
        name="Productos"
        component={Productos}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="shoppingcart" size={size} color={color} />
          ),
        }}
        name="Imagenes"
        component={Imagenes}
      />
    </Tabs.Navigator>
  );
}
