import { Text, StyleSheet, ScrollView, FlatList, View, Image } from "react-native";
import { Button } from "react-native-paper";


export function Venta({route}) {
  const {cliente, detalles, entregado, fecha} = route.params
  return (
    <ScrollView >

      <View style = {{alignItems:"center", flexDirection: "row", justifyContent:"space-between", padding:10}}>
        <View>
        <Text style={{ fontSize:25}}>Cliente: {cliente.nombre} </Text>
        <Text style={[{ fontSize:25,}, entregado ? {color: "green"}: {color:"red"}]}>Entregado: {entregado ? "Si": "No"} </Text>
        <Text style={{ fontSize:25}}>Fecha: {new Date(fecha).toLocaleString()} </Text>
        <Text style={{ fontSize:25}}>Productos: </Text>
        </View>
        <Button mode="contained">Marcar como Entregado</Button>

      </View>
      
      <FlatList data = {detalles} keyExtractor = {(item,i) => i.toString() } renderItem = {({item}) => (
        <View style={{flexDirection:"row", marginVertical: 10}}>

          <Image 
            source = {{uri:item.producto.imagenes[0].url, width:100, height:100}}
          />
          <View style = {{marginStart:10}}>
          <Text> { item.producto.nombre } </Text>
          <Text> Precio: lps. { item.precio } </Text>
          <Text> Total: lps. { item.precio*item.cantidad } </Text>
          <Text> Cantidad: { item.cantidad } </Text>
          </View>
          
        </View>
      ) } /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});


