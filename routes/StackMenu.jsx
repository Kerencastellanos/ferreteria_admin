import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context";
import { Login } from "../pages";
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
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="login" component={Login} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
