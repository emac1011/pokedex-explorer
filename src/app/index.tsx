import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getPokemonList } from "../api/pokemonApi";
import { PokemonListItem } from "../components/pokemon/PokemonListItem";
import { PokemonListItem as PokemonListItemType } from "../types/pokemon";

export default function HomeScreen() {
  const [pokemon, setPokemon] = useState<PokemonListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPokemon();
  }, []);

  async function loadPokemon() {
    try {
      setLoading(true);
      setError(null);

      const data = await getPokemonList(20, 0);

      setPokemon(data.results);
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          No se pudieron cargar los Pokémon
        </Text>

        <Text style={styles.errorText}>
          {error}
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
        Pokémon disponibles: {pokemon.length}
      </Text>

      <FlatList
        data={pokemon}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <PokemonListItem
            pokemon={item}
            index={index}
          />
        )}
      />
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
  statusText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },
});