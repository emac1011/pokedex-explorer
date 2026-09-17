import { router } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { COLORS, FONTS } from "../../constants/colors";
import {
    PokemonListItem as PokemonListItemType,
} from "../../types/pokemon";

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

  const formattedId = String(pokemonId).padStart(3, "0");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={openPokemon}
    >
      <View style={styles.topRow}>
        <Text style={styles.number}>
          #{formattedId}
        </Text>

        <View style={styles.pixelDecoration}>
          <View style={styles.pixel} />
          <View style={styles.pixel} />
          <View style={styles.pixel} />
        </View>
      </View>

      <View style={styles.separator} />

      <Text style={styles.name}>
        {pokemon.name.toUpperCase()}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.dexLabel}>
          NATIONAL DEX
        </Text>

        <Text style={styles.openLabel}>
          VER ▶
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 116,

    marginBottom: 12,

    padding: 14,

    backgroundColor: COLORS.white,

    borderWidth: 3,
    borderColor: COLORS.black,

    borderRadius: 0,

    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      width: 5,
      height: 5,
    },

    elevation: 5,
  },

  pressed: {
    transform: [
      {
        translateX: 4,
      },
      {
        translateY: 4,
      },
    ],

    shadowOffset: {
      width: 1,
      height: 1,
    },
  },

  topRow: {
    minHeight: 22,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  number: {
    color: COLORS.red,

    fontFamily: FONTS.pixel,

    fontSize: 12,

    fontWeight: "bold",
  },

  pixelDecoration: {
    flexDirection: "row",

    gap: 4,
  },

  pixel: {
    width: 7,
    height: 7,

    backgroundColor: COLORS.red,
  },

  separator: {
    height: 3,

    marginTop: 8,
    marginBottom: 13,

    backgroundColor: COLORS.black,
  },

  name: {
    color: COLORS.black,

    fontFamily: FONTS.pixel,

    fontSize: 15,

    fontWeight: "bold",
  },

  bottomRow: {
    marginTop: 14,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  dexLabel: {
    color: COLORS.gray,

    fontFamily: FONTS.pixel,

    fontSize: 7,

    fontWeight: "bold",
  },

  openLabel: {
    color: COLORS.red,

    fontFamily: FONTS.pixel,

    fontSize: 7,

    fontWeight: "bold",
  },
});