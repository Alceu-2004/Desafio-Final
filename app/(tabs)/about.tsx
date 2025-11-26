import { View, Text } from "react-native";

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18 }}>
        CineVault — Aplicativo para explorar filmes, favoritos e informações.
      </Text>
    </View>
  );
}
