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

import {
  getPokemonById,
  getPokemonByName,
  getPokemonList,
} from "../api/pokemonApi";
import { PokemonListItem } from "../components/pokemon/PokemonListItem";
import { PokemonListItem as PokemonListItemType } from "../types/pokemon";

const PAGE_SIZE = 20;

export default function HomeScreen() {
  const [pokemon, setPokemon] = useState<PokemonListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const [offset, setOffset] = useState(0);
  const [totalPokemon, setTotalPokemon] = useState(0);

  useEffect(() => {
    loadPokemon(0);
  }, []);

  async function loadPokemon(newOffset: number) {
    try {
      setLoading(true);
      setError(null);

      const data = await getPokemonList(
        PAGE_SIZE,
        newOffset
      );

      setPokemon(data.results);
      setTotalPokemon(data.count);
      setOffset(newOffset);
    } catch (error) {
      console.error("Error al cargar Pokémon:", error);

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
        result = await getPokemonById(Number(query));
      } else {
        result = await getPokemonByName(query);
      }

      router.push(`/pokemon/${result.id}`);
    } catch (error) {
      console.error("Error al buscar Pokémon:", error);

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

    loadPokemon(Math.max(0, offset - PAGE_SIZE));
  }

  function goToNextPage() {
    if (offset + PAGE_SIZE >= totalPokemon) {
      return;
    }

    loadPokemon(offset + PAGE_SIZE);
  }

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
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.statusText}>
          Cargando Pokémon...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pokédex
      </Text>

      <Text style={styles.subtitle}>
        Explora los Pokémon de la Pokédex Nacional
      </Text>

      <Pressable
        style={styles.favoritesButton}
        onPress={() => router.push("/favorites")}
      >
        <Text style={styles.favoritesButtonText}>
          ❤️ Ver favoritos
        </Text>
      </Pressable>

      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Nombre o número, ej. Pikachu o 25"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="search"
          onSubmitEditing={searchPokemon}
        />

        <Pressable
          style={[
            styles.searchButton,
            searching && styles.disabledButton,
          ]}
          onPress={searchPokemon}
          disabled={searching}
        >
          <Text style={styles.searchButtonText}>
            {searching ? "Buscando..." : "Buscar"}
          </Text>
        </Pressable>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            No se pudo completar la operación
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          Pokémon
        </Text>

        <Text style={styles.counter}>
          {currentStart}-{currentEnd} de {totalPokemon}
        </Text>
      </View>

      <FlatList
        data={pokemon}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PokemonListItem
            pokemon={item}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.pagination}>
        <Pressable
          style={[
            styles.pageButton,
            offset === 0 && styles.disabledButton,
          ]}
          onPress={goToPreviousPage}
          disabled={offset === 0}
        >
          <Text style={styles.pageButtonText}>
            ◀ Anterior
          </Text>
        </Pressable>

        <Text style={styles.pageText}>
          Página {Math.floor(offset / PAGE_SIZE) + 1}
        </Text>

        <Pressable
          style={[
            styles.pageButton,
            offset + PAGE_SIZE >= totalPokemon &&
              styles.disabledButton,
          ]}
          onPress={goToNextPage}
          disabled={offset + PAGE_SIZE >= totalPokemon}
        >
          <Text style={styles.pageButtonText}>
            Siguiente ▶
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  favoritesButton: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  favoritesButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  searchButton: {
    marginTop: 10,
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.4,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  counter: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 10,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
  },
  pageButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  pageText: {
    fontSize: 14,
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 5,
    fontSize: 14,
  },
});