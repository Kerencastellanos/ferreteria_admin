import axios from "axios";
import { useEffect, useState} from "react";
import { StyleSheet, View, FlatList } from "react-native";

export function ResumenVentas() {
    useEffect(() => {
      obtenerVentas()
      
    }, [])

    const [ventas, setVentas] = useState([])
    async function obtenerVentas() {
        const {data} = await axios.get('/ventas/listar')
        setVentas(data.ventas)
    }
    
    return (
        <View style={ styles.container} >
            <FlatList 
            data = {ventas}
            keyExtractor = {(item)=>item.id}
            renderItem = {()=>(
                <View>
                    <Text>Ventas</Text>
                </View>
            )}
            />
        </View>
    )
    
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})