import { router } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoritesScreen() {
  const {
    favorites,
    loading,
    removeFavorite,
  } = useFavorites();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.statusText}>
          Cargando favoritos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ❤️ Mis favoritos
      </Text>

      <Text style={styles.subtitle}>
        Pokémon guardados en tu dispositivo
      </Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No tienes favoritos
          </Text>

          <Text style={styles.emptyText}>
            Agrega Pokémon desde su pantalla de
            detalle para verlos aquí.
          </Text>

          <Pressable
            style={styles.exploreButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.buttonText}>
              Explorar Pokémon
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.favoriteCard}>
              <Pressable
                style={styles.pokemonInfo}
                onPress={() =>
                  router.push(`/pokemon/${item.id}`)
                }
              >
                <Text style={styles.number}>
                  #{item.id.toString().padStart(3, "0")}
                </Text>

                <Text style={styles.name}>
                  {item.name}
                </Text>
              </Pressable>

              <Pressable
                style={styles.removeButton}
                onPress={() =>
                  removeFavorite(item.id)
                }
              >
                <Text style={styles.removeButtonText}>
                  Eliminar
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
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
  statusText: {
    marginTop: 12,
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  favoriteCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  pokemonInfo: {
    flex: 1,
  },
  number: {
    fontSize: 14,
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  removeButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  exploreButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});