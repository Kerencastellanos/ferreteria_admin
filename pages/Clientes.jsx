import axios from "axios";
import { useEffect } from "react";
import { FlatList, View } from "react-native";

export function Clientes(params) {
    const [usuarios, setUsuarios] = useState([])
    useEffect(() => {
      obtenerClientes()
    }, [])

    async function obtenerClientes(){
        const {data} = await axios.get('/usuarios')
        setUsuarios(data.usuario)
    }
    return (
        <View>
            <FlatList
            data={usuarios}
            keyExtractor={(item)=>item.id}
            />
        </View>
    )
}