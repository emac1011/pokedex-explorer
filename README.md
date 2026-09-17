# Pokédex Explorer

Aplicación móvil desarrollada con React Native y Expo que permite explorar información de Pokémon utilizando la PokéAPI. La aplicación también permite guardar Pokémon como favoritos mediante almacenamiento persistente local.

## Descripción

Pokédex Explorer es un proyecto desarrollado para el curso **Programación para Dispositivos Móviles (TPA-4001)**.

La aplicación consume información en tiempo real desde una API REST pública y permite al usuario:

- Explorar la Pokédex Nacional.
- Navegar entre páginas de Pokémon.
- Ir directamente a una página específica.
- Buscar Pokémon por nombre o número.
- Consultar información detallada de cada Pokémon.
- Guardar Pokémon como favoritos.
- Consultar los favoritos guardados.
- Eliminar Pokémon de favoritos.
- Mantener los favoritos almacenados aunque la aplicación se cierre.

## Tecnologías utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- Context API
- AsyncStorage
- PokéAPI

## API utilizada

La aplicación utiliza **PokéAPI**, una API REST pública que proporciona información sobre Pokémon.

La aplicación realiza peticiones HTTP para obtener:

- Lista de Pokémon.
- Información individual de cada Pokémon.
- Tipos.
- Estadísticas.
- Habilidades.
- Sprites e imágenes oficiales.

API:

https://pokeapi.co/

## Persistencia local

La aplicación utiliza **AsyncStorage** para almacenar los Pokémon marcados como favoritos en el dispositivo.

La gestión de los datos locales se encuentra separada de las vistas:

```text
src/services/favoritesStorage.ts