import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context";
import { StackMenu } from "./routes";
import { Provider as PaperProvider } from "react-native-paper";
import axios from "axios";

// axios = permite realizar las peticiones al backend(api)
// url base de todas las solicitudes
axios.defaults.baseURL = "https://ferreteria-movil.herokuapp.com/api";
// axios.defaults.baseURL = "http://192.168.0.13:3030/api";

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
