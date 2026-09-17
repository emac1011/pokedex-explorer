import AsyncStorage from "@react-native-async-storage/async-storage";

import { PokemonDetail } from "../types/pokemon";

const FAVORITES_KEY = "@pokedex_explorer_favorites";

export async function getFavorites(): Promise<PokemonDetail[]> {
  try {
    const storedFavorites = await AsyncStorage.getItem(
      FAVORITES_KEY
    );

    if (!storedFavorites) {
      return [];
    }

    return JSON.parse(storedFavorites) as PokemonDetail[];
  } catch (error) {
    console.error(
      "Error al obtener los favoritos:",
      error
    );

    return [];
  }
}

export async function saveFavorite(
  pokemon: PokemonDetail
): Promise<void> {
  try {
    const favorites = await getFavorites();

    const alreadyFavorite = favorites.some(
      (item) => item.id === pokemon.id
    );

    if (alreadyFavorite) {
      return;
    }

    const updatedFavorites = [
      ...favorites,
      pokemon,
    ];

    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updatedFavorites)
    );
  } catch (error) {
    console.error(
      "Error al guardar el favorito:",
      error
    );

    throw error;
  }
}

export async function deleteFavorite(
  pokemonId: number
): Promise<void> {
  try {
    const favorites = await getFavorites();

    const updatedFavorites = favorites.filter(
      (item) => item.id !== pokemonId
    );

    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updatedFavorites)
    );
  } catch (error) {
    console.error(
      "Error al eliminar el favorito:",
      error
    );

    throw error;
  }
}

export async function clearFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error(
      "Error al limpiar los favoritos:",
      error
    );

    throw error;
  }
}