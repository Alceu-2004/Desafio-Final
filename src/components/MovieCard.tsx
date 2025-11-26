import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";

export default function MovieCard({ movie }: any) {
  const openDetails = () => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id },
    });
  };

  return (
    <Pressable
      onPress={openDetails}
      style={{ flexDirection: "row", padding: 10 }}
    >
      <Image
        source={{ uri: movie.image }}
        style={{ width: 70, height: 100, marginRight: 10 }}
      />

      <View style={{ justifyContent: "center" }}>
        <Text style={{ fontSize: 18 }}>{movie.title}</Text>
        {movie.year && <Text>{movie.year}</Text>}
      </View>
    </Pressable>
  );
}
