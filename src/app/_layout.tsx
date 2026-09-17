import { Stack } from "expo-router";

import { FavoritesProvider } from "../context/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Pokédex",
          }}
        />

        <Stack.Screen
          name="pokemon/[id]"
          options={{
            title: "Pokémon",
          }}
        />

        <Stack.Screen
          name="favorites"
          options={{
            title: "Favoritos",
          }}
        />
      </Stack>
    </FavoritesProvider>
  );
}