import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context";
import { Cliente, Login, RecuperarClave } from "../pages";
import { Tabsmenu } from "./Tabsmenu";

const Stack = createNativeStackNavigator();

export function StackMenu() {
  const { isAuth } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {isAuth ? (
        <Stack.Group>
          <Stack.Screen
            options={{ headerShown: false }}
            name="TabsMenu"
            component={Tabsmenu}
          />
          <Stack.Screen name="Cliente" component={Cliente} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="RecuperarClave" component={RecuperarClave} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
