import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context";
import { StackMenu } from "./routes";
import { Provider as PaperProvider } from "react-native-paper";
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthProvider>
          <StackMenu />
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
