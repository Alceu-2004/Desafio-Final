import { Stack } from "expo-router";
import { FavoritesProvider } from "../src/contexts/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ title: "Detalhes" }} />
        <Stack.Screen name="add-movie/index" options={{ title: "Adicionar Filmes" }} />
      </Stack>
    </FavoritesProvider>
  );
}
