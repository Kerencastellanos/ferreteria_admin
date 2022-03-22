import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context";
import { StackMenu } from "./routes";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackMenu />
      </AuthProvider>
    </NavigationContainer>
  );
}
