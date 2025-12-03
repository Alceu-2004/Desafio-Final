import { Stack } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { MoviesProvider } from "../src/contexts/MoviesContext";

function RootLayoutNav() {
  const { user } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="(drawer)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <RootLayoutNav />
      </MoviesProvider>
    </AuthProvider>
  );
}