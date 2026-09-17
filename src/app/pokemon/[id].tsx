import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPokemonById } from "../../api/pokemonApi";
import { PixelHeart } from "../../components/common/PixelHeart";
import { PixelPokeball } from "../../components/common/PixelPokeball";
import { PokemonCard } from "../../components/pokemon/PokemonCard";
import { COLORS, FONTS } from "../../constants/colors";
import { useFavorites } from "../../context/FavoritesContext";
import { PokemonDetail } from "../../types/pokemon";

export default function PokemonDetailScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const [pokemon, setPokemon] =
    useState<PokemonDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  const {
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites();

  useEffect(() => {
    loadPokemon();
  }, [id]);

  async function loadPokemon() {
    try {
      setLoading(true);
      setError(null);

      const pokemonId = Number(id);

      if (!pokemonId) {
        throw new Error(
          "ID de Pokémon inválido."
        );
      }

      const data =
        await getPokemonById(pokemonId);

      setPokemon(data);
    } catch (error) {
      console.error(
        "Error al cargar el Pokémon:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cargar el Pokémon."
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite() {
    if (!pokemon) {
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite(pokemon.id)) {
        await removeFavorite(
          pokemon.id
        );
      } else {
        await addFavorite(pokemon);
      }
    } catch (error) {
      console.error(
        "Error al actualizar favorito:",
        error
      );

      setError(
        "No se pudo actualizar el favorito."
      );
    } finally {
      setFavoriteLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <PixelPokeball size={86} />

        <Text style={styles.loadingTitle}>
          POKÉDEX
        </Text>

        <Text style={styles.loadingText}>
          CARGANDO POKÉMON...
        </Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.errorScreen}>
        <PixelPokeball />

        <Text style={styles.errorTitle}>
          [!] ERROR
        </Text>

        <Text style={styles.errorText}>
          {error ??
            "Pokémon no encontrado."}
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            ◀ VOLVER
          </Text>
        </Pressable>
      </View>
    );
  }

  const favorite = isFavorite(
    pokemon.id
  );

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
            NATIONAL DEX
          </Text>

          <Text style={styles.headerTitle}>
            #{String(pokemon.id).padStart(
              3,
              "0"
            )}
          </Text>
        </View>

        <PixelPokeball />
      </View>

      <SafeAreaView
        style={styles.safeArea}
        edges={["bottom"]}
      >
        <ScrollView
          contentContainerStyle={
            styles.container
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <PokemonCard
            pokemon={pokemon}
          />

          <Pressable
            style={({ pressed }) => [
              styles.favoriteButton,
              favorite &&
                styles.removeFavoriteButton,
              favoriteLoading &&
                styles.disabledButton,
              pressed &&
                !favoriteLoading &&
                styles.pressedButton,
            ]}
            onPress={toggleFavorite}
            disabled={favoriteLoading}
          >
            <PixelHeart />

            <View
              style={styles.favoriteButtonInfo}
            >
              <Text
                style={
                  styles.favoriteButtonTitle
                }
              >
                {favorite
                  ? "EN FAVORITOS"
                  : "AGREGAR A FAVORITOS"}
              </Text>

              <Text
                style={
                  styles.favoriteButtonSubtitle
                }
              >
                {favorite
                  ? "TOCA PARA ELIMINAR"
                  : "GUARDAR EN EL DISPOSITIVO"}
              </Text>
            </View>

            <Text
              style={styles.favoriteArrow}
            >
              {favorite
                ? "X"
                : "▶"}
            </Text>
          </Pressable>

          <View style={styles.section}>
            <View
              style={styles.sectionTitleRow}
            >
              <View
                style={styles.sectionPixel}
              />

              <Text
                style={styles.sectionTitle}
              >
                INFORMACIÓN
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                ALTURA
              </Text>

              <Text style={styles.infoValue}>
                {pokemon.height / 10} m
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                PESO
              </Text>

              <Text style={styles.infoValue}>
                {pokemon.weight / 10} kg
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                EXPERIENCIA BASE
              </Text>

              <Text style={styles.infoValue}>
                {pokemon.base_experience ??
                  "N/D"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View
              style={styles.sectionTitleRow}
            >
              <View
                style={styles.sectionPixel}
              />

              <Text
                style={styles.sectionTitle}
              >
                HABILIDADES
              </Text>
            </View>

            {pokemon.abilities.map(
              (item) => (
                <View
                  key={item.slot}
                  style={styles.abilityRow}
                >
                  <Text
                    style={
                      styles.bullet
                    }
                  >
                    ■
                  </Text>

                  <Text
                    style={
                      styles.abilityText
                    }
                  >
                    {item.ability.name.toUpperCase()}
                  </Text>

                  {item.is_hidden && (
                    <Text
                      style={
                        styles.hiddenText
                      }
                    >
                      OCULTA
                    </Text>
                  )}
                </View>
              )
            )}
          </View>

          <View style={styles.section}>
            <View
              style={styles.sectionTitleRow}
            >
              <View
                style={styles.sectionPixel}
              />

              <Text
                style={styles.sectionTitle}
              >
                ESTADÍSTICAS
              </Text>
            </View>

            {pokemon.stats.map(
              (item) => (
                <View
                  key={item.stat.name}
                  style={styles.statRow}
                >
                  <Text
                    style={
                      styles.statName
                    }
                  >
                    {item.stat.name.toUpperCase()}
                  </Text>

                  <View
                    style={
                      styles.statBarContainer
                    }
                  >
                    <View
                      style={[
                        styles.statBar,
                        {
                          width: `${Math.min(
                            item.base_stat,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={
                      styles.statValue
                    }
                  >
                    {item.base_stat}
                  </Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
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

  safeArea: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 28,
  },

  favoriteButton: {
    minHeight: 70,

    backgroundColor: COLORS.white,

    borderWidth: 3,
    borderColor: COLORS.red,

    paddingHorizontal: 12,

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

    marginBottom: 14,
  },

  removeFavoriteButton: {
    borderColor: COLORS.redDark,
  },

  favoriteButtonInfo: {
    flex: 1,
  },

  favoriteButtonTitle: {
    color: COLORS.black,
    fontFamily: FONTS.pixel,
    fontSize: 8,
    fontWeight: "bold",
  },

  favoriteButtonSubtitle: {
    marginTop: 6,
    color: COLORS.gray,
    fontFamily: FONTS.pixel,
    fontSize: 5,
    fontWeight: "bold",
  },

  favoriteArrow: {
    color: COLORS.red,
    fontFamily: FONTS.pixel,
    fontSize: 11,
    fontWeight: "bold",
  },

  section: {
    backgroundColor: COLORS.white,

    borderWidth: 3,
    borderColor: "#B7D8E5",

    padding: 14,

    marginBottom: 14,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  sectionPixel: {
    width: 8,
    height: 8,

    backgroundColor: COLORS.red,

    marginRight: 8,
  },

  sectionTitle: {
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 9,
    fontWeight: "bold",
  },

  infoRow: {
    minHeight: 38,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 2,
    borderBottomColor: "#E2EEF2",
  },

  infoLabel: {
    color: COLORS.gray,
    fontFamily: FONTS.pixel,
    fontSize: 6,
    fontWeight: "bold",
  },

  infoValue: {
    color: COLORS.black,
    fontFamily: FONTS.pixel,
    fontSize: 8,
    fontWeight: "bold",
  },

  abilityRow: {
    minHeight: 38,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 2,
    borderBottomColor: "#E2EEF2",
  },

  bullet: {
    color: COLORS.red,
    fontSize: 8,
    marginRight: 9,
  },

  abilityText: {
    flex: 1,
    color: COLORS.black,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    fontWeight: "bold",
  },

  hiddenText: {
    color: COLORS.red,
    fontFamily: FONTS.pixel,
    fontSize: 5,
    fontWeight: "bold",
  },

  statRow: {
    minHeight: 42,

    flexDirection: "row",
    alignItems: "center",
  },

  statName: {
    width: 72,

    color: COLORS.blueDark,

    fontFamily: FONTS.pixel,

    fontSize: 5,

    fontWeight: "bold",
  },

  statBarContainer: {
    flex: 1,

    height: 12,

    backgroundColor: COLORS.blueLight,

    borderWidth: 2,
    borderColor: "#B7D8E5",

    marginHorizontal: 8,
  },

  statBar: {
    height: "100%",
    backgroundColor: COLORS.red,
  },

  statValue: {
    width: 28,

    color: COLORS.black,

    fontFamily: FONTS.pixel,

    fontSize: 7,

    fontWeight: "bold",

    textAlign: "right",
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

  disabledButton: {
    opacity: 0.4,
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

  errorScreen: {
    flex: 1,
    backgroundColor: COLORS.bluePale,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  errorTitle: {
    marginTop: 20,
    color: COLORS.red,
    fontFamily: FONTS.pixel,
    fontSize: 11,
    fontWeight: "bold",
  },

  errorText: {
    marginTop: 12,
    color: COLORS.blueDark,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    lineHeight: 14,
    textAlign: "center",
  },

  backButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.pixel,
    fontSize: 7,
    fontWeight: "bold",
  },
});