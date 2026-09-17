import { router } from "expo-router";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PixelHeart } from "../components/common/PixelHeart";
import { PixelPokeball } from "../components/common/PixelPokeball";
import { COLORS, FONTS } from "../constants/colors";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoritesScreen() {
  const {
    favorites,
    loading,
    removeFavorite,
  } = useFavorites();

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <PixelPokeball size={86} />

        <Text style={styles.loadingTitle}>
          FAVORITOS
        </Text>

        <Text style={styles.loadingText}>
          CARGANDO...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>
            ◀
          </Text>

          <Text style={styles.backText}>
            VOLVER
          </Text>
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSmall}>
            POKÉDEX
          </Text>

          <Text style={styles.headerTitle}>
            FAVORITOS
          </Text>
        </View>

        <PixelPokeball />
      </View>

      <SafeAreaView
        style={styles.content}
        edges={["bottom"]}
      >
        <View style={styles.sectionHeader}>
          <PixelHeart />

          <View style={styles.sectionHeaderText}>
            <Text style={styles.title}>
              MIS FAVORITOS
            </Text>

            <Text style={styles.subtitle}>
              POKÉMON GUARDADOS EN TU DISPOSITIVO
            </Text>
          </View>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>
                SIN FAVORITOS
              </Text>

              <View style={styles.emptyLine} />

              <Text style={styles.emptyText}>
                Todavía no tienes Pokémon
                guardados.
              </Text>

              <Text style={styles.emptyText}>
                Agrega uno desde su pantalla
                de detalle.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.exploreButton,
                pressed &&
                  styles.pressedButton,
              ]}
              onPress={() =>
                router.push("/")
              }
            >
              <Text style={styles.buttonArrow}>
                ▶
              </Text>

              <Text style={styles.buttonText}>
                EXPLORAR POKÉMON
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) =>
              item.id.toString()
            }
            contentContainerStyle={
              styles.listContent
            }
            showsVerticalScrollIndicator={
              false
            }
            renderItem={({ item }) => (
              <View style={styles.favoriteCard}>
                <Pressable
                  style={styles.pokemonInfo}
                  onPress={() =>
                    router.push(
                      `/pokemon/${item.id}`
                    )
                  }
                >
                  <View
                    style={styles.cardTop}
                  >
                    <Text
                      style={styles.number}
                    >
                      #
                      {item.id
                        .toString()
                        .padStart(
                          3,
                          "0"
                        )}
                    </Text>

                    <View
                      style={
                        styles.cardPixels
                      }
                    >
                      <View
                        style={
                          styles.cardPixel
                        }
                      />

                      <View
                        style={
                          styles.cardPixel
                        }
                      />

                      <View
                        style={
                          styles.cardPixel
                        }
                      />
                    </View>
                  </View>

                  <View
                    style={styles.cardLine}
                  />

                  <Text
                    style={styles.name}
                  >
                    {item.name.toUpperCase()}
                  </Text>

                  <Text
                    style={
                      styles.cardLabel
                    }
                  >
                    NATIONAL DEX
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed &&
                      styles.pressedRemove,
                  ]}
                  onPress={() =>
                    removeFavorite(
                      item.id
                    )
                  }
                >
                  <Text
                    style={
                      styles.removeButtonText
                    }
                  >
                    X
                  </Text>

                  <Text
                    style={
                      styles.removeLabel
                    }
                  >
                    ELIMINAR
                  </Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bluePale,
  },

  header: {
    minHeight: 104,

    backgroundColor: COLORS.red,

    paddingTop: 42,
    paddingHorizontal: 14,
    paddingBottom: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 6,
    borderBottomColor: COLORS.redDeep,
  },

  backButton: {
    minWidth: 78,
    height: 38,

    backgroundColor: COLORS.white,

    borderWidth: 3,
    borderColor: COLORS.black,

    paddingHorizontal: 7,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backArrow: {
    color: COLORS.red,
    fontSize: 10,
  },

  backText: {
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 6,
    fontWeight: "bold",
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },

  headerSmall: {
    color: "#FFD6D1",
    fontFamily: FONTS.pixel,
    fontSize: 6,
    fontWeight: "bold",
    letterSpacing: 2,
  },

  headerTitle: {
    marginTop: 5,
    color: COLORS.white,
    fontFamily: FONTS.pixel,
    fontSize: 15,
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  sectionHeader: {
    minHeight: 68,

    backgroundColor: COLORS.white,

    borderWidth: 3,
    borderColor: COLORS.red,

    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,

    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      width: 4,
      height: 4,
    },

    elevation: 4,
  },

  sectionHeaderText: {
    flex: 1,
  },

  title: {
    color: COLORS.black,
    fontFamily: FONTS.pixel,
    fontSize: 12,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 6,
    color: COLORS.gray,
    fontFamily: FONTS.pixel,
    fontSize: 6,
    fontWeight: "bold",
  },

  listContent: {
    paddingBottom: 20,
  },

  favoriteCard: {
    minHeight: 126,

    marginBottom: 13,

    padding: 13,

    backgroundColor: COLORS.white,

    borderWidth: 3,
    borderColor: COLORS.black,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      width: 4,
      height: 4,
    },

    elevation: 4,
  },

  pokemonInfo: {
    flex: 1,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  number: {
    color: COLORS.red,
    fontFamily: FONTS.pixel,
    fontSize: 10,
    fontWeight: "bold",
  },

  cardPixels: {
    flexDirection: "row",
    gap: 4,
  },

  cardPixel: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.red,
  },

  cardLine: {
    height: 3,
    backgroundColor: COLORS.black,
    marginTop: 9,
    marginBottom: 13,
  },

  name: {
    color: COLORS.black,
    fontFamily: FONTS.pixel,
    fontSize: 12,
    fontWeight: "bold",
  },

  cardLabel: {
    marginTop: 12,
    color: COLORS.gray,
    fontFamily: FONTS.pixel,
    fontSize: 6,
    fontWeight: "bold",
  },

  removeButton: {
    width: 66,
    height: 58,

    marginLeft: 8,

    backgroundColor: COLORS.red,

    borderWidth: 3,
    borderColor: COLORS.redDark,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      width: 2,
      height: 2,
    },

    elevation: 2,
  },

  pressedRemove: {
    transform: [
      {
        translateX: 2,
      },
      {
        translateY: 2,
      },
    ],
  },

  removeButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.pixel,
    fontSize: 12,
    fontWeight: "bold",
  },

  removeLabel: {
    marginTop: 5,
    color: COLORS.white,
    fontFamily: FONTS.pixel,
    fontSize: 5,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  emptyBox: {
    width: "100%",

    backgroundColor: COLORS.white,

    borderWidth: 3,
    borderColor: COLORS.black,

    padding: 20,

    alignItems: "center",
  },

  emptyTitle: {
    color: COLORS.red,
    fontFamily: FONTS.pixel,
    fontSize: 12,
    fontWeight: "bold",
  },

  emptyLine: {
    width: 70,
    height: 3,
    backgroundColor: COLORS.red,
    marginTop: 10,
    marginBottom: 14,
  },

  emptyText: {
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    lineHeight: 14,
    textAlign: "center",
  },

  exploreButton: {
    marginTop: 18,

    height: 48,

    paddingHorizontal: 14,

    backgroundColor: COLORS.red,

    borderWidth: 3,
    borderColor: COLORS.redDark,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      width: 3,
      height: 3,
    },

    elevation: 3,
  },

  buttonArrow: {
    color: COLORS.white,
    fontSize: 10,
    marginRight: 10,
  },

  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    fontWeight: "bold",
  },

  pressedButton: {
    transform: [
      {
        translateX: 3,
      },
      {
        translateY: 3,
      },
    ],
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.bluePale,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingTitle: {
    marginTop: 20,
    color: COLORS.red,
    fontFamily: FONTS.pixel,
    fontSize: 14,
    fontWeight: "bold",
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    fontWeight: "bold",
  },
});