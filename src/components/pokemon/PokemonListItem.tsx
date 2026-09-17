import { StyleSheet, Text, View } from "react-native";

import { PokemonListItem as PokemonListItemType } from "../../types/pokemon";

interface PokemonListItemProps {
  pokemon: PokemonListItemType;
  index: number;
}

export function PokemonListItem({
  pokemon,
  index,
}: PokemonListItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>
        #{String(index + 1).padStart(3, "0")}
      </Text>

      <Text style={styles.name}>
        {pokemon.name}
      </Text>
    </View>
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