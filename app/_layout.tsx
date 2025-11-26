import { Stack } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { FavoritesProvider } from "../src/contexts/FavoritesContext";

function RootLayoutNav() {
  const { user } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}

      <Stack.Screen name="movie/[id]" />
      <Stack.Screen name="add-movie/index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <RootLayoutNav />
      </FavoritesProvider>
    </AuthProvider>
  );
}
