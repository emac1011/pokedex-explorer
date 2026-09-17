import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getPokemonById,
  getPokemonByName,
  getPokemonList,
} from "../api/pokemonApi";
import { PixelHeart } from "../components/common/PixelHeart";
import { PokemonListItem } from "../components/pokemon/PokemonListItem";
import { COLORS, FONTS } from "../constants/colors";
import {
  PokemonListItem as PokemonListItemType,
} from "../types/pokemon";

const PAGE_SIZE = 20;

export default function HomeScreen() {
  const [pokemon, setPokemon] = useState<
    PokemonListItemType[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState("");

  const [searching, setSearching] = useState(false);

  const [offset, setOffset] = useState(0);

  const [totalPokemon, setTotalPokemon] = useState(0);

  const [pageInput, setPageInput] = useState("1");

  const [changingPage, setChangingPage] = useState(false);

  useEffect(() => {
    loadPokemon(0);
  }, []);

  async function loadPokemon(newOffset: number) {
    try {
      setError(null);

      if (pokemon.length === 0) {
        setLoading(true);
      }

      const data = await getPokemonList(
        PAGE_SIZE,
        newOffset
      );

      setPokemon(data.results);
      setTotalPokemon(data.count);
      setOffset(newOffset);

      const newPage =
        Math.floor(newOffset / PAGE_SIZE) + 1;

      setPageInput(newPage.toString());
    } catch (error) {
      console.error(
        "Error al cargar Pokémon:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cargar los Pokémon."
      );
    } finally {
      setLoading(false);
    }
  }

  async function searchPokemon() {
    const query = search.trim();

    if (!query) {
      return;
    }

    try {
      setSearching(true);
      setError(null);

      let result;

      if (/^\d+$/.test(query)) {
        result = await getPokemonById(
          Number(query)
        );
      } else {
        result = await getPokemonByName(query);
      }

      router.push(`/pokemon/${result.id}`);
    } catch (error) {
      console.error(
        "Error al buscar Pokémon:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo encontrar el Pokémon."
      );
    } finally {
      setSearching(false);
    }
  }

  function goToPreviousPage() {
    if (offset === 0) {
      return;
    }

    loadPokemon(
      Math.max(0, offset - PAGE_SIZE)
    );
  }

  function goToNextPage() {
    if (
      offset + PAGE_SIZE >=
      totalPokemon
    ) {
      return;
    }

    loadPokemon(
      offset + PAGE_SIZE
    );
  }

  async function goToManualPage() {
    const page = Number(pageInput);

    const totalPages = Math.ceil(
      totalPokemon / PAGE_SIZE
    );

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      page > totalPages
    ) {
      setPageInput(
        (Math.floor(offset / PAGE_SIZE) + 1).toString()
      );

      setError(
        `La página debe estar entre 1 y ${totalPages}.`
      );

      return;
    }

    const newOffset =
      (page - 1) * PAGE_SIZE;

    if (newOffset === offset) {
      return;
    }

    try {
      setChangingPage(true);
      setError(null);

      await loadPokemon(newOffset);
    } finally {
      setChangingPage(false);
    }
  }

  const currentPage =
    Math.floor(offset / PAGE_SIZE) + 1;

  const totalPages =
    totalPokemon === 0
      ? 1
      : Math.ceil(
          totalPokemon / PAGE_SIZE
        );

  const currentStart =
    totalPokemon === 0
      ? 0
      : offset + 1;

  const currentEnd = Math.min(
    offset + PAGE_SIZE,
    totalPokemon
  );

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingPokeball}>
          <View style={styles.loadingPokeballTop} />

          <View
            style={styles.loadingPokeballCenter}
          >
            <View
              style={styles.loadingPokeballButton}
            />
          </View>
        </View>

        <Text style={styles.loadingTitle}>
          POKÉDEX
        </Text>

        <ActivityIndicator
          size="large"
          color={COLORS.red}
        />

        <Text style={styles.loadingText}>
          CARGANDO...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSmall}>
            NATIONAL
          </Text>

          <Text style={styles.headerTitle}>
            POKÉDEX
          </Text>
        </View>

        <View style={styles.headerPokeball}>
          <View style={styles.headerPokeballTop} />

          <View
            style={styles.headerPokeballCenter}
          >
            <View
              style={styles.headerPokeballButton}
            />
          </View>
        </View>
      </View>

      <SafeAreaView
        style={styles.content}
        edges={["bottom"]}
      >
        <Text style={styles.subtitle}>
          EXPLORA LOS POKÉMON DE LA POKÉDEX NACIONAL
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.favoritesButton,
            pressed && styles.pressedButton,
          ]}
          onPress={() =>
            router.push("/favorites")
          }
        >
          <PixelHeart />

          <Text style={styles.favoritesButtonText}>
            MIS FAVORITOS
          </Text>

          <Text style={styles.favoritesArrow}>
            ▶
          </Text>
        </Pressable>

        <View style={styles.searchBox}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionPixel} />

            <Text style={styles.searchLabel}>
              BUSCAR POKÉMON
            </Text>
          </View>

          <View style={styles.searchRow}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="NOMBRE O NUMERO..."
              placeholderTextColor="#78909C"
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="search"
              onSubmitEditing={
                searchPokemon
              }
            />

            <Pressable
              style={[
                styles.searchButton,
                searching &&
                  styles.disabledButton,
              ]}
              onPress={searchPokemon}
              disabled={searching}
            >
              <Text
                style={
                  styles.searchButtonText
                }
              >
                {searching
                  ? "..."
                  : "BUSCAR"}
              </Text>
            </Pressable>
          </View>
        </View>

        {error && (
          <View
            style={styles.errorContainer}
          >
            <Text style={styles.errorTitle}>
              [!] ERROR
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>
              POKÉMON
            </Text>

            <View
              style={styles.titlePixels}
            >
              <View
                style={styles.titlePixel}
              />

              <View
                style={styles.titlePixel}
              />

              <View
                style={styles.titlePixel}
              />

              <View
                style={styles.titlePixel}
              />

              <View
                style={styles.titlePixel}
              />
            </View>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.counter}>
              {currentStart}-
              {currentEnd}
            </Text>

            <Text
              style={styles.counterTotal}
            >
              /{totalPokemon}
            </Text>
          </View>
        </View>

        <FlatList
          data={pokemon}
          keyExtractor={(item) =>
            item.name
          }
          renderItem={({ item }) => (
            <PokemonListItem
              pokemon={item}
            />
          )}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={
            false
          }
        />

        <View style={styles.pagination}>
          <Pressable
            style={({ pressed }) => [
              styles.pageButton,
              offset === 0 &&
                styles.disabledButton,
              pressed &&
                offset !== 0 &&
                styles.pagePressed,
            ]}
            onPress={
              goToPreviousPage
            }
            disabled={offset === 0}
          >
            <Text
              style={
                styles.pageArrow
              }
            >
              ◀
            </Text>

            <Text
              style={
                styles.pageButtonLabel
              }
            >
              ANTERIOR
            </Text>
          </Pressable>

          <View
            style={styles.pageIndicator}
          >
            <Text
              style={
                styles.pageIndicatorLabel
              }
            >
              PÁGINA
            </Text>

            <View
              style={
                styles.pageNumberRow
              }
            >
              <TextInput
                value={pageInput}
                onChangeText={(value) => {
                  const numericValue =
                    value.replace(
                      /[^0-9]/g,
                      ""
                    );

                  setPageInput(
                    numericValue
                  );
                }}
                style={styles.pageInput}
                keyboardType="number-pad"
                selectTextOnFocus
                maxLength={2}
                editable={!changingPage}
                onSubmitEditing={
                  goToManualPage
                }
              />

              <Text
                style={
                  styles.pageTotal
                }
              >
                /{totalPages}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.goPageButton,
                changingPage &&
                  styles.disabledButton,
                pressed &&
                  !changingPage &&
                  styles.pagePressed,
              ]}
              onPress={
                goToManualPage
              }
              disabled={changingPage}
            >
              <Text
                style={
                  styles.goPageText
                }
              >
                {changingPage
                  ? "..."
                  : "IR"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.pageButton,
              offset + PAGE_SIZE >=
                totalPokemon &&
                styles.disabledButton,
              pressed &&
                offset + PAGE_SIZE <
                  totalPokemon &&
                styles.pagePressed,
            ]}
            onPress={
              goToNextPage
            }
            disabled={
              offset + PAGE_SIZE >=
              totalPokemon
            }
          >
            <Text
              style={
                styles.pageButtonLabel
              }
            >
              SIGUIENTE
            </Text>

            <Text
              style={
                styles.pageArrow
              }
            >
              ▶
            </Text>
          </Pressable>
        </View>
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
    backgroundColor: COLORS.red,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 6,
    borderBottomColor: COLORS.redDeep,
  },

  headerSmall: {
    color: "#FFD6D1",
    fontFamily: FONTS.pixel,
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 3,
  },

  headerTitle: {
    marginTop: 7,
    color: COLORS.white,
    fontFamily: FONTS.pixel,
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  headerPokeball: {
    width: 58,
    height: 58,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.black,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  headerPokeballTop: {
    position: "absolute",
    top: 0,
    width: 58,
    height: 27,
    backgroundColor: COLORS.red,
  },

  headerPokeballCenter: {
    width: 58,
    height: 7,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },

  headerPokeballButton: {
    width: 22,
    height: 22,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.black,
    borderRadius: 11,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  subtitle: {
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 8,
    lineHeight: 15,
    marginBottom: 13,
  },

  favoritesButton: {
    height: 58,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.red,
    borderRadius: 0,
    paddingHorizontal: 14,
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

  pressedButton: {
    transform: [
      {
        translateX: 3,
      },
      {
        translateY: 3,
      },
    ],
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },

  favoritesButtonText: {
    flex: 1,
    color: COLORS.black,
    fontFamily: FONTS.pixel,
    fontSize: 11,
    fontWeight: "bold",
  },

  favoritesArrow: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: "bold",
  },

  searchBox: {
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: "#B7D8E5",
    borderRadius: 0,
    padding: 13,
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  sectionPixel: {
    width: 7,
    height: 7,
    backgroundColor: COLORS.red,
    marginRight: 7,
  },

  searchLabel: {
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 9,
    fontWeight: "bold",
  },

  searchRow: {
    flexDirection: "row",
    gap: 8,
  },

  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.blueLight,
    borderWidth: 2,
    borderColor: "#B7D8E5",
    borderRadius: 0,
    paddingHorizontal: 12,
    color: COLORS.black,
    fontFamily: FONTS.pixel,
    fontSize: 9,
  },

  searchButton: {
    height: 48,
    minWidth: 92,
    paddingHorizontal: 12,
    backgroundColor: COLORS.red,
    borderWidth: 3,
    borderColor: COLORS.redDark,
    borderRadius: 0,
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

  searchButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.pixel,
    fontSize: 8,
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.35,
  },

  errorContainer: {
    backgroundColor: "#FFF1EE",
    borderWidth: 3,
    borderColor: COLORS.red,
    borderRadius: 0,
    padding: 11,
    marginBottom: 12,
  },

  errorTitle: {
    color: COLORS.redDeep,
    fontFamily: FONTS.pixel,
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 6,
  },

  errorText: {
    color: "#4A2520",
    fontFamily: FONTS.pixel,
    fontSize: 7,
    lineHeight: 13,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 9,
  },

  listTitle: {
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 17,
    fontWeight: "bold",
  },

  titlePixels: {
    flexDirection: "row",
    gap: 3,
    marginTop: 6,
  },

  titlePixel: {
    width: 9,
    height: 4,
    backgroundColor: COLORS.red,
  },

  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.blueLight,
    borderWidth: 2,
    borderColor: "#B7D8E5",
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  counter: {
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 8,
    fontWeight: "bold",
  },

  counterTotal: {
    color: COLORS.gray,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    fontWeight: "bold",
    marginLeft: 2,
  },

  listContent: {
    paddingBottom: 8,
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 12,
  },

  pageButton: {
    minWidth: 106,
    height: 44,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: "#A9CBD9",
    borderRadius: 0,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 3,
  },

  pagePressed: {
    transform: [
      {
        translateX: 2,
      },
      {
        translateY: 2,
      },
    ],
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },

  pageArrow: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: "bold",
  },

  pageButtonLabel: {
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    fontWeight: "bold",
  },

  pageIndicator: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 62,
  },

  pageIndicatorLabel: {
    color: COLORS.gray,
    fontFamily: FONTS.pixel,
    fontSize: 6,
    fontWeight: "bold",
    marginBottom: 4,
  },

  pageNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  pageInput: {
    width: 38,
    height: 30,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.black,
    color: COLORS.red,
    fontFamily: FONTS.pixel,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    padding: 0,
  },

  pageTotal: {
    color: COLORS.gray,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    fontWeight: "bold",
    marginLeft: 4,
  },

  goPageButton: {
    marginTop: 5,
    minWidth: 38,
    height: 24,
    backgroundColor: COLORS.red,
    borderWidth: 2,
    borderColor: COLORS.redDark,
    alignItems: "center",
    justifyContent: "center",
  },

  goPageText: {
    color: COLORS.white,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    fontWeight: "bold",
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.bluePale,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingPokeball: {
    width: 86,
    height: 86,
    backgroundColor: COLORS.white,
    borderWidth: 5,
    borderColor: COLORS.black,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  loadingPokeballTop: {
    position: "absolute",
    top: 0,
    width: 86,
    height: 40,
    backgroundColor: COLORS.red,
  },

  loadingPokeballCenter: {
    width: 86,
    height: 8,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingPokeballButton: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.white,
    borderWidth: 5,
    borderColor: COLORS.black,
    borderRadius: 14,
  },

  loadingTitle: {
    marginTop: 20,
    marginBottom: 14,
    color: COLORS.red,
    fontFamily: FONTS.pixel,
    fontSize: 19,
    fontWeight: "bold",
    letterSpacing: 2,
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 8,
    fontWeight: "bold",
  },
});