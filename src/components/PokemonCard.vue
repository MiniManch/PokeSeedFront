<template>
    <div>
      <!-- Example of rendering fetched Pokémon data -->
      <div v-if="pokemon">
        <h2>{{ pokemon.name }}</h2>
        <img :src="pokemon.frontSprite" alt="Front Sprite">
        <img :src="pokemon.backSprite" alt="Back Sprite">
        <audio :src="pokemon.cry" controls></audio>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        pokemon: null, // This will hold the fetched Pokémon data
        error: null,   // This will hold any error messages
      };
    },
    methods: {
      async fetchPokemonByName(name) {
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}/api/pokemon/${name}`);
          if (!response.ok) {
            throw new Error('Failed to fetch Pokémon');
          }
          this.pokemon = await response.json();
          console.log(this.pokemon)
        } catch (error) {
          this.error = error.message;
          console.error('Error fetching Pokémon:', error);
        }
      }
    },
    mounted() {
      // Example of fetching Pokémon by name when the component is mounted
      this.fetchPokemonByName('pidgeot');
    }
  }
  </script>
  