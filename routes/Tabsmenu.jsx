import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CrearProducto, ResumenVentas } from "../pages";


const Tabs = createBottomTabNavigator();

export function Tabsmenu() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="CrearProducto" component={CrearProducto} />
      <Tabs.Screen name="Clientes" component={CrearProducto} />
      <Tabs.Screen name="Ventas" component={ResumenVentas} />
    </Tabs.Navigator>
  );
}
