import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    deleteFavorite,
    getFavorites,
    saveFavorite,
} from "../services/favoritesStorage";
import { PokemonDetail } from "../types/pokemon";

interface FavoritesContextType {
  favorites: PokemonDetail[];
  loading: boolean;
  addFavorite: (pokemon: PokemonDetail) => Promise<void>;
  removeFavorite: (pokemonId: number) => Promise<void>;
  isFavorite: (pokemonId: number) => boolean;
}

const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({
  children,
}: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<
    PokemonDetail[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setLoading(true);

      const storedFavorites = await getFavorites();

      setFavorites(storedFavorites);
    } catch (error) {
      console.error(
        "Error al cargar los favoritos:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function addFavorite(
    pokemon: PokemonDetail
  ): Promise<void> {
    await saveFavorite(pokemon);

    setFavorites((currentFavorites) => {
      const alreadyFavorite = currentFavorites.some(
        (item) => item.id === pokemon.id
      );

      if (alreadyFavorite) {
        return currentFavorites;
      }

      return [...currentFavorites, pokemon];
    });
  }

  async function removeFavorite(
    pokemonId: number
  ): Promise<void> {
    await deleteFavorite(pokemonId);

    setFavorites((currentFavorites) =>
      currentFavorites.filter(
        (item) => item.id !== pokemonId
      )
    );
  }

  function isFavorite(pokemonId: number): boolean {
    return favorites.some(
      (item) => item.id === pokemonId
    );
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe utilizarse dentro de FavoritesProvider."
    );
  }

  return context;
}