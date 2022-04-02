import axios from "axios";
import { Text, useWindowDimensions, Image, FlatList } from "react-native";
import { useState, useEffect } from "react";
export function Imagenes() {
  const { width } = useWindowDimensions();
  const [imgs, setImgs] = useState([]);
  useEffect(() => {
    axios.get("/imagenes").then(({ data }) => {
      setImgs(data);
    });
  }, []);

  return (
    <FlatList
      data={imgs}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <>
          <Image source={{ uri: item.imagenUrl, width, height: width }} />
          <Text>{item.imagenUrl}</Text>
          <Text>{index + 1}</Text>
        </>
      )}
    />
  );
}
