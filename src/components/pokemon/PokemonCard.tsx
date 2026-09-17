import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { COLORS, FONTS } from "../../constants/colors";
import { PokemonDetail } from "../../types/pokemon";

interface PokemonCardProps {
  pokemon: PokemonDetail;
}

export function PokemonCard({
  pokemon,
}: PokemonCardProps) {
  const image =
    pokemon.sprites.other?.[
      "official-artwork"
    ]?.front_default ??
    pokemon.sprites.front_default;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.number}>
          #
          {String(pokemon.id).padStart(
            3,
            "0"
          )}
        </Text>

        <View style={styles.pixels}>
          <View style={styles.pixel} />
          <View style={styles.pixel} />
          <View style={styles.pixel} />
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.main}>
        <View style={styles.info}>
          <Text style={styles.name}>
            {pokemon.name.toUpperCase()}
          </Text>

          <View style={styles.typeContainer}>
            {pokemon.types.map(
              (item) => (
                <View
                  key={item.slot}
                  style={styles.typeBox}
                >
                  <Text
                    style={styles.typeText}
                  >
                    {item.type.name.toUpperCase()}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {image && (
          <View style={styles.imageBox}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.dexLabel}>
          NATIONAL DEX
        </Text>

        <Text style={styles.idLabel}>
          #{String(pokemon.id).padStart(
            3,
            "0"
          )}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 245,

    backgroundColor: COLORS.white,

    borderWidth: 3,
    borderColor: COLORS.black,

    padding: 14,

    marginBottom: 14,

    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      width: 5,
      height: 5,
    },

    elevation: 5,
  },

  topRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  number: {
    color: COLORS.red,

    fontFamily: FONTS.pixel,

    fontSize: 11,

    fontWeight: "bold",
  },

  pixels: {
    flexDirection: "row",

    gap: 4,
  },

  pixel: {
    width: 7,
    height: 7,

    backgroundColor: COLORS.red,
  },

  line: {
    height: 3,

    backgroundColor: COLORS.black,

    marginTop: 9,
  },

  main: {
    minHeight: 150,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  info: {
    flex: 1,

    paddingRight: 8,
  },

  name: {
    color: COLORS.black,

    fontFamily: FONTS.pixel,

    fontSize: 15,

    fontWeight: "bold",
  },

  typeContainer: {
    marginTop: 13,

    flexDirection: "row",

    flexWrap: "wrap",

    gap: 6,
  },

  typeBox: {
    backgroundColor: COLORS.blueLight,

    borderWidth: 2,
    borderColor: "#91CFE3",

    paddingHorizontal: 7,
    paddingVertical: 6,
  },

  typeText: {
    color: COLORS.blueDark,

    fontFamily: FONTS.pixel,

    fontSize: 5,

    fontWeight: "bold",
  },

  imageBox: {
    width: 145,
    height: 145,

    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 140,
    height: 140,
  },

  bottomRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    borderTopWidth: 2,

    borderTopColor: "#E2EEF2",

    paddingTop: 10,
  },

  dexLabel: {
    color: COLORS.gray,

    fontFamily: FONTS.pixel,

    fontSize: 6,

    fontWeight: "bold",
  },

  idLabel: {
    color: COLORS.red,

    fontFamily: FONTS.pixel,

    fontSize: 7,

    fontWeight: "bold",
  },
});