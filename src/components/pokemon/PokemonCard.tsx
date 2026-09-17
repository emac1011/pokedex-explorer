import { Image, StyleSheet, Text, View } from "react-native";
import { PokemonDetail } from "../../types/pokemon";

interface PokemonCardProps {
  pokemon: PokemonDetail;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const image =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default;

  const types = pokemon.types
    .map((item) => item.type.name)
    .join(" / ");

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.number}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>

        <Text style={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>

        <Text style={styles.types}>{types}</Text>
      </View>

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 150,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  info: {
    flex: 1,
  },
  number: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777777",
  },
  name: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "bold",
    color: "#222222",
  },
  types: {
    marginTop: 8,
    fontSize: 15,
    color: "#555555",
    textTransform: "capitalize",
  },
  image: {
    width: 120,
    height: 120,
  },
});