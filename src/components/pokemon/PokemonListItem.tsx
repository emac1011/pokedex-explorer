import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { PokemonListItem as PokemonListItemType } from "../../types/pokemon";

interface PokemonListItemProps {
  pokemon: PokemonListItemType;
}

export function PokemonListItem({
  pokemon,
}: PokemonListItemProps) {
  function openPokemon() {
    const pokemonId = Number(
      pokemon.url.split("/").filter(Boolean).pop()
    );

    router.push(`/pokemon/${pokemonId}`);
  }

  const pokemonId = Number(
    pokemon.url.split("/").filter(Boolean).pop()
  );

  return (
    <Pressable
      style={styles.container}
      onPress={openPokemon}
    >
      <Text style={styles.number}>
        #{String(pokemonId).padStart(3, "0")}
      </Text>

      <Text style={styles.name}>
        {pokemon.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  number: {
    fontSize: 14,
  },
  name: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});