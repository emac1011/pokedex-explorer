import {
    PokemonDetail,
    PokemonListResponse,
} from "../types/pokemon";

const API_URL = "https://pokeapi.co/api/v2";

const NATIONAL_DEX_LIMIT = 1025;

export async function getPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const safeLimit = Math.min(limit, NATIONAL_DEX_LIMIT - offset);

  const response = await fetch(
    `${API_URL}/pokemon?limit=${safeLimit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al obtener los Pokémon. Código: ${response.status}`
    );
  }

  const data: PokemonListResponse = await response.json();

  return {
    ...data,
    count: NATIONAL_DEX_LIMIT,
  };
}

export async function getPokemonById(
  id: number
): Promise<PokemonDetail> {
  if (id < 1 || id > NATIONAL_DEX_LIMIT) {
    throw new Error(
      "El número debe estar entre 1 y 1025."
    );
  }

  const response = await fetch(
    `${API_URL}/pokemon/${id}`
  );

  if (!response.ok) {
    throw new Error(
      `No se pudo obtener el Pokémon. Código: ${response.status}`
    );
  }

  const data: PokemonDetail = await response.json();

  return data;
}

export async function getPokemonByName(
  name: string
): Promise<PokemonDetail> {
  const normalizedName = name.trim().toLowerCase();

  if (!normalizedName) {
    throw new Error(
      "Debes ingresar un nombre de Pokémon."
    );
  }

  const response = await fetch(
    `${API_URL}/pokemon/${normalizedName}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "No se encontró ese Pokémon."
      );
    }

    throw new Error(
      `Error al buscar el Pokémon. Código: ${response.status}`
    );
  }

  const data: PokemonDetail = await response.json();

  if (data.id > NATIONAL_DEX_LIMIT) {
    throw new Error(
      "Ese Pokémon está fuera de la Pokédex Nacional disponible en esta aplicación."
    );
  }

  return data;
}