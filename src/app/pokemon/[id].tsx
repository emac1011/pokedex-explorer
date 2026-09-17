import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { getPokemonById } from "../../api/pokemonApi";
import { PokemonCard } from "../../components/pokemon/PokemonCard";
import { PokemonDetail } from "../../types/pokemon";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPokemon();
  }, [id]);

  async function loadPokemon() {
    try {
      setLoading(true);
      setError(null);

      const pokemonId = Number(id);

      if (!pokemonId) {
        throw new Error("ID de Pokémon inválido.");
      }

      const data = await getPokemonById(pokemonId);

      setPokemon(data);
    } catch (error) {
      console.error("Error al cargar el Pokémon:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cargar el Pokémon."
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

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          No se pudo cargar el Pokémon
        </Text>

        <Text style={styles.errorText}>
          {error ?? "Pokémon no encontrado."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PokemonCard pokemon={pokemon} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Información
        </Text>

        <Text style={styles.info}>
          Altura: {pokemon.height / 10} m
        </Text>

        <Text style={styles.info}>
          Peso: {pokemon.weight / 10} kg
        </Text>

        <Text style={styles.info}>
          Experiencia base:{" "}
          {pokemon.base_experience ?? "No disponible"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Habilidades
        </Text>

        {pokemon.abilities.map((item) => (
          <Text
            key={item.slot}
            style={styles.info}
          >
            • {item.ability.name}
            {item.is_hidden ? " (oculta)" : ""}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Estadísticas
        </Text>

        {pokemon.stats.map((item) => (
          <View
            key={item.stat.name}
            style={styles.statRow}
          >
            <Text style={styles.statName}>
              {item.stat.name}
            </Text>

            <Text style={styles.statValue}>
              {item.base_stat}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
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
  section: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    textTransform: "capitalize",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  statName: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});