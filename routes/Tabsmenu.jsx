import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Clientes, CrearProducto, ResumenVentas, Productos } from "../pages";
import { AntDesign } from "@expo/vector-icons";


const Tabs = createBottomTabNavigator();

export function Tabsmenu() {
  return (
    <Tabs.Navigator>
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
    </Tabs.Navigator>
  );
}
